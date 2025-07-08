export interface CSVRow {
  Task?: string;
  Description: string;
  Actions: string;
  Objects: string;
}

export interface SearchResult {
  item: CSVRow;
  score?: number;
  matches?: any[];
  instructions?: string;
}

export interface UploadState {
  isUploading: boolean;
  isUploaded: boolean;
  error: string | null;
  fileName: string | null;
}

export interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export interface MistralResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface TogetherResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}


export interface AIProviderOption {
  id: AIProvider;
  name: string;
  description: string;
}

export interface AIProvider {
  id: string;
  name: string;
  apiKey: string;
  endpoint: string;
}

export interface TaskPlan {
  content: string;
  timestamp: Date;
  provider: string;
  method: string;
}

export type SequencingMethod = 'sequential' | 'parallel';

export interface ComparisonResult {
  sequential: string;
  parallel: string;
}