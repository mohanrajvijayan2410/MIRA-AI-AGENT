import { AIProviderConfig } from '../types';

export const AI_PROVIDERS: AIProviderConfig[] = [
  {
    id: 'groq',
    name: 'Groq',
    apiKey: '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',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    apiKey: '',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
  },
  {
    id: 'mistral',
    name: 'Mistral',
    apiKey: '',
    endpoint: 'https://api.mistral.ai/v1/chat/completions'
  },
  {
    id: 'together',
    name: 'Together AI',
    apiKey: '',
    endpoint: 'https://api.together.xyz/v1/chat/completions'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    apiKey: '',
    endpoint: 'https://api.deepseek.com/v1/chat/completions'
  }
];
