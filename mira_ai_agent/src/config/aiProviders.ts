import { AIProvider } from '../types';

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'groq',
    name: 'Groq',
    apiKey: 'gsk_u...UECIdNVtK46',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    apiKey: 'AIza....FxNOIn6gw',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
  },
  {
    id: 'mistral',
    name: 'Mistral',
    apiKey: 'cUao1..qMdJl0F',
  endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
  },
  {
    id: 'together',
    name: 'Together AI',
    apiKey: 'tgp_v1_...A5pzQ_VD4',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
  }
];