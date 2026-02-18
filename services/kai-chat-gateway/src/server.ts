import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { randomUUID } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { kaiPersona, buildPersonaPrompt } from './persona/kai-v1.js';
import { runProvider } from './providers/index.js';
import type { ChatMessage, ModelProvider } from './types.js';

function loadDotEnvFile(): void {
  const runtimeDir = resolve(fileURLToPath(new URL('.', import.meta.url)));
  const projectRoot = resolve(runtimeDir, '..');
  const candidates = [resolve(process.cwd(), '.env'), resolve(projectRoot, '.env')];

  for (const envPath of candidates) {
    if (!existsSync(envPath)) {
      continue;
    }

    const content = readFileSync(envPath, 'utf8');
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) {
        continue;
      }

      const separator = line.indexOf('=');
      if (separator < 1) {
        continue;
      }

      const key = line.slice(0, separator).trim();
      if (!key || process.env[key] !== undefined) {
        continue;
      }

      let value = line.slice(separator + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      process.env[key] = value;
    }
  }
}

loadDotEnvFile();

const app = Fastify({ logger: true });

const ChatMessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string().min(1).max(8000),
});

const ChatRequestSchema = z.object({
  provider: z.enum(['anthropic', 'gemini']),
  model: z.string().min(1).max(120).optional(),
  messages: z.array(ChatMessageSchema).min(1).max(40),
  personaId: z.literal('kai-v1'),
  stream: z.boolean().optional(),
  locale: z.enum(['zh-CN', 'en-US']).optional(),
});

function readAllowedOrigins(): string[] {
  return (process.env.ALLOWED_ORIGINS || 'https://kateiso.dev,http://localhost:4321')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function fallbackProvider(provider: ModelProvider): ModelProvider {
  return provider === 'anthropic' ? 'gemini' : 'anthropic';
}

function hasProviderKey(provider: ModelProvider): boolean {
  return provider === 'anthropic'
    ? Boolean(process.env.ANTHROPIC_API_KEY)
    : Boolean(process.env.GEMINI_API_KEY);
}

function splitForStreaming(text: string): string[] {
  const parts = text.match(/\S+\s*/g);
  return parts && parts.length ? parts : [text];
}

function composeMessages(systemPrompt: string, messages: ChatMessage[]): ChatMessage[] {
  const withoutSystem = messages.filter((message) => message.role !== 'system');
  return [{ role: 'system', content: systemPrompt }, ...withoutSystem];
}

async function runWithFallback(input: {
  provider: ModelProvider;
  model: string;
  messages: ChatMessage[];
  locale?: 'zh-CN' | 'en-US';
}) {
  const systemPrompt = buildPersonaPrompt(input.locale);
  const messages = composeMessages(systemPrompt, input.messages);

  try {
    return await runProvider({
      provider: input.provider,
      model: input.model,
      messages,
      systemPrompt,
    });
  } catch (primaryError) {
    const allowFallback = process.env.ENABLE_PROVIDER_FALLBACK !== 'false';
    if (!allowFallback) {
      throw primaryError;
    }

    const backup = fallbackProvider(input.provider);
    if (!hasProviderKey(backup)) {
      app.log.warn({ primary: input.provider, backup }, 'Backup provider key is missing, skip fallback');
      throw primaryError;
    }

    app.log.warn({ err: primaryError, primary: input.provider, backup }, 'Primary provider failed, switching provider');

    return runProvider({
      provider: backup,
      model: '',
      messages,
      systemPrompt,
    });
  }
}

await app.register(cors, {
  origin: readAllowedOrigins(),
  credentials: false,
});

await app.register(rateLimit, {
  max: Number(process.env.RATE_LIMIT_MAX || 20),
  timeWindow: process.env.RATE_LIMIT_WINDOW || '10 minutes',
  keyGenerator: (request) => request.ip,
});

app.get('/health', async () => ({
  ok: true,
  service: 'kai-chat-gateway',
  version: '0.1.0',
  now: new Date().toISOString(),
}));

app.get('/v1/persona/kai', async () => ({
  ok: true,
  persona: kaiPersona,
}));

app.post('/v1/chat', async (request, reply) => {
  const parsed = ChatRequestSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({ ok: false, error: parsed.error.flatten() });
  }

  const payload = parsed.data;
  const requestId = randomUUID();

  try {
    const output = await runWithFallback({
      provider: payload.provider,
      model: payload.model || '',
      messages: payload.messages,
      locale: payload.locale,
    });

    return reply.send({
      ok: true,
      requestId,
      provider: output.provider,
      model: output.model,
      text: output.text,
    });
  } catch (error) {
    request.log.error({ err: error, requestId }, 'Chat completion failed');
    return reply.code(502).send({ ok: false, requestId, error: 'chat_provider_unavailable' });
  }
});

app.post('/v1/chat/stream', async (request, reply) => {
  const parsed = ChatRequestSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.code(400).send({ ok: false, error: parsed.error.flatten() });
  }

  const payload = parsed.data;
  const requestId = randomUUID();

  reply.hijack();
  const raw = reply.raw;
  raw.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
  });

  const writeEvent = (data: Record<string, unknown>) => {
    raw.write(`data: ${JSON.stringify({ requestId, ...data })}\n\n`);
  };

  try {
    const output = await runWithFallback({
      provider: payload.provider,
      model: payload.model || '',
      messages: payload.messages,
      locale: payload.locale,
    });

    const chunks = splitForStreaming(output.text);
    for (const token of chunks) {
      writeEvent({ type: 'token', text: token, provider: output.provider, model: output.model });
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    writeEvent({ type: 'done', provider: output.provider, model: output.model });
  } catch (error) {
    request.log.error({ err: error, requestId }, 'Chat streaming failed');
    writeEvent({ type: 'error', text: 'chat_provider_unavailable' });
  } finally {
    raw.end();
  }
});

const port = Number(process.env.PORT || 8787);
const host = process.env.HOST || '0.0.0.0';

app.listen({ port, host }).catch((error) => {
  app.log.error(error, 'Failed to start kai-chat-gateway');
  process.exit(1);
});
