import type { ChatMessage, ModelProvider } from '../types.js';

export interface ProviderInput {
  provider: ModelProvider;
  model: string;
  messages: ChatMessage[];
  systemPrompt: string;
}

export interface ProviderOutput {
  text: string;
  provider: ModelProvider;
  model: string;
}

function cleanModel(provider: ModelProvider, model: string): string {
  const normalized = (model || '').trim();
  if (!normalized) {
    return provider === 'anthropic' ? 'claude-3-5-sonnet-20241022' : 'gemini-1.5-pro';
  }
  return normalized.startsWith('models/') ? normalized.slice('models/'.length) : normalized;
}

function assertText(text: unknown): string {
  const value = typeof text === 'string' ? text.trim() : '';
  if (!value) {
    throw new Error('empty_model_response');
  }
  return value;
}

async function callAnthropic(input: ProviderInput): Promise<ProviderOutput> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('missing_anthropic_api_key');
  }

  const model = cleanModel('anthropic', input.model);
  const messages = input.messages
    .filter((message) => message.role === 'user' || message.role === 'assistant')
    .map((message) => ({ role: message.role, content: message.content }));

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      temperature: 0.6,
      system: input.systemPrompt,
      messages,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`anthropic_http_${response.status}:${details.slice(0, 240)}`);
  }

  const data = await response.json() as {
    content?: Array<{ type: string; text?: string }>;
  };
  const text = assertText(data.content?.find((part) => part.type === 'text')?.text);

  return { text, provider: 'anthropic', model };
}

async function callGemini(input: ProviderInput): Promise<ProviderOutput> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('missing_gemini_api_key');
  }

  const model = cleanModel('gemini', input.model);
  const contents = input.messages
    .filter((message) => message.role === 'user' || message.role === 'assistant')
    .map((message) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.content }],
    }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: input.systemPrompt }],
        },
        contents,
        generationConfig: {
          maxOutputTokens: 1024,
          temperature: 0.6,
        },
      }),
    },
  );

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`gemini_http_${response.status}:${details.slice(0, 240)}`);
  }

  const data = await response.json() as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  const text = assertText(data.candidates?.[0]?.content?.parts?.[0]?.text);
  return { text, provider: 'gemini', model };
}

export async function runProvider(input: ProviderInput): Promise<ProviderOutput> {
  if (input.provider === 'anthropic') {
    return callAnthropic(input);
  }
  return callGemini(input);
}
