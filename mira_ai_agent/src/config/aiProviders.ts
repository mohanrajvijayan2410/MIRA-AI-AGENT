import { AIProvider } from '../types';

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'groq',
    name: 'Groq',
    apiKey: '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',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    apiKey: 'AIzaSyB6YE8xVpxt-XJ0LIUhZDwpD1FxNOIn6gw',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
  },
  {
    id: 'mistral',
    name: 'Mistral',
    apiKey: 'cUao194okz2YZD8RiFG1crvMWqMdJl0F',
  endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
  },
  {
    id: 'together',
    name: 'Together AI',
    apiKey: 'tgp_v1_l79LM6FLR8oAFEYSPQ3UmXVhdj7SDzWTsEA5pzQ_VD4',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
  }
];