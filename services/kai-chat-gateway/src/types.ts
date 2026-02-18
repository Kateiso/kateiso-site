export type ModelProvider = 'anthropic' | 'gemini';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  provider: ModelProvider;
  model: string;
  messages: ChatMessage[];
  personaId: 'kai-v1';
  stream?: boolean;
  locale?: 'zh-CN' | 'en-US';
}

export interface PersonaProfile {
  id: 'kai-v1';
  version: string;
  identity: string;
  tone: string[];
  values: string[];
  doNot: string[];
  faq: Array<{ q: string; a: string }>;
}
