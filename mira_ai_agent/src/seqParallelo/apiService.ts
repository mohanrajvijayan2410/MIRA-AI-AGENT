import { AIProvider } from '../types';

// API Keys - hardcoded for direct usage
const API_KEYS = {
  groq: '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',
  gemini: 'AIzaSyB6YE8xVpxt-XJ0LIUhZDwpD1FxNOIn6gw',
  mistral: 'cUao194okz2YZD8RiFG1crvMWqMdJl0F',
  together: 'tgp_v1_l79LM6FLR8oAFEYSPQ3UmXVhdj7SDzWTsEA5pzQ_VD4',
  deepseek: 'sk-28c79757504d43dd9c077db4f2abe318'
};

export class ApiService {
  private async callGroq(prompt: string): Promise<string> {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEYS.groq}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that creates detailed task execution plans. Always follow the exact formatting requirements provided by the user.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from Groq API');
    }

    return data.choices[0].message.content.trim();
  }

  private async callGemini(prompt: string): Promise<string> {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEYS.gemini}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are a helpful assistant that creates detailed task execution plans. Always follow the exact formatting requirements provided by the user.

${prompt}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content.parts[0]) {
      throw new Error('No response from Gemini API');
    }

    return data.candidates[0].content.parts[0].text.trim();
  }

  private async callMistral(prompt: string): Promise<string> {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEYS.mistral}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that creates detailed task execution plans. Always follow the exact formatting requirements provided by the user.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from Mistral API');
    }

    return data.choices[0].message.content.trim();
  }

  private async callTogether(prompt: string): Promise<string> {
    const response = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEYS.together}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/Llama-2-70b-chat-hf',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that creates detailed task execution plans. Always follow the exact formatting requirements provided by the user.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Together AI error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from Together AI');
    }

    return data.choices[0].message.content.trim();
  }

  private async callDeepSeek(prompt: string): Promise<string> {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEYS.deepseek}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that creates detailed task execution plans. Always follow the exact formatting requirements provided by the user.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from DeepSeek API');
    }

    return data.choices[0].message.content.trim();
  }

  async generatePlan(provider: AIProvider, prompt: string): Promise<string> {
    try {
      switch (provider.id) {
        case 'groq':
          return await this.callGroq(prompt);
        case 'gemini':
          return await this.callGemini(prompt);
        case 'mistral':
          return await this.callMistral(prompt);
        case 'together':
          return await this.callTogether(prompt);
        case 'deepseek':
          return await this.callDeepSeek(prompt);
        default:
          throw new Error(`Unsupported AI provider: ${provider.id}`);
      }
    } catch (error) {
      console.error(`Error generating plan with ${provider.name}:`, error);
      throw new Error(
        error instanceof Error 
          ? `Failed to generate plan using ${provider.name}: ${error.message}`
          : `Failed to generate plan using ${provider.name}`
      );
    }
  }
}