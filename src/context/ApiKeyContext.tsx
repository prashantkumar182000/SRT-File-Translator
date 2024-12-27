// src/contexts/ApiKeyContext.tsx
import React, { createContext, useState, useContext } from 'react';

interface ApiKeyContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  isKeyValid: boolean;
  validateKey: () => Promise<void>;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

export const ApiKeyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKey] = useState('');
  const [isKeyValid, setIsKeyValid] = useState(false);

  const validateKey = async () => {
    try {
      // Send a minimal request to Anthropic API to validate the key
      const response = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1,
          messages: [{
            role: 'user',
            content: 'test'
          }]
        })
      });
      
      setIsKeyValid(response.ok);
    } catch {
      setIsKeyValid(false);
    }
  };

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey, isKeyValid, validateKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKey = () => {
  const context = useContext(ApiKeyContext);
  if (!context) throw new Error('useApiKey must be used within ApiKeyProvider');
  return context;
};