// src/utils/anthropicConfig.ts

interface AnthropicConfig {
  apiKey: string;
  baseURL: string;
  headers: {
    'Content-Type': string;
    'x-api-key': string;
    'anthropic-version': string;
  };
}

export const createAnthropicConfig = (apiKey: string): AnthropicConfig => {
  return {
    apiKey,
    baseURL: 'https://api.anthropic.com/v1/messages',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    }
  };
};

export const createAnthropicMessage = (prompt: string) => {
  return {
    model: 'claude-3-sonnet-20240229',
    max_tokens: 4096,
    messages: [{
      role: 'user',
      content: prompt
    }]
  };
};