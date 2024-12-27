// src/utils/translator.ts
import { Language, SrtEntry } from '../types';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const MAX_TEXT_LENGTH = 1000; // Reduced from 5000 to 1000 characters
const DELAY_BETWEEN_CHUNKS = 1500; // 1.5 seconds delay between chunks

interface TranslationResponse {
  translated_text: string;
}

export const translateChunk = async (
  textToTranslate: string,
  targetLanguage: Language,
  apiUrl: string,
  retryCount: number = 0
): Promise<string> => {
  try {
    console.log(`Attempting to translate chunk of length: ${textToTranslate.length}`);
    
    // Additional validation
    if (textToTranslate.length > MAX_TEXT_LENGTH) {
      throw new Error('Chunk size exceeds maximum allowed length');
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        text: textToTranslate,
        target_language: targetLanguage
      })
    });

    if (response.status === 503) {
      throw new Error('Service temporarily unavailable. Retrying...');
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as TranslationResponse;
    return data.translated_text;

  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      const delay = RETRY_DELAY * Math.pow(2, retryCount);
      console.log(`Retrying after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return translateChunk(textToTranslate, targetLanguage, apiUrl, retryCount + 1);
    }
    throw error;
  }
};

export const translateWithChunks = async (
  entries: SrtEntry[],
  targetLanguage: Language,
  apiUrl: string,
  onProgress: (progress: number) => void
): Promise<SrtEntry[]> => {
  try {
    // Create smaller chunks based on text length
    const chunks: SrtEntry[][] = [];
    let currentChunk: SrtEntry[] = [];
    let currentLength = 0;

    for (const entry of entries) {
      const entryLength = entry.text.length;
      
      if (currentLength + entryLength > MAX_TEXT_LENGTH || currentChunk.length >= 5) {
        if (currentChunk.length > 0) {
          chunks.push(currentChunk);
        }
        currentChunk = [entry];
        currentLength = entryLength;
      } else {
        currentChunk.push(entry);
        currentLength += entryLength;
      }
    }
    
    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }

    console.log(`Created ${chunks.length} chunks for translation`);
    console.log(`Average chunk size: ${chunks.reduce((acc, chunk) => 
      acc + chunk.reduce((sum, entry) => sum + entry.text.length, 0), 0) / chunks.length} characters`);

    const translatedEntries: SrtEntry[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      
      // Extract only the text content
      const textsToTranslate = chunk
        .map(entry => entry.text)
        .join('\n');
      
      console.log(`Processing chunk ${i + 1}/${chunks.length}, text length: ${textsToTranslate.length}`);

      try {
        // Add delay between chunks
        if (i > 0) {
          await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_CHUNKS));
        }

        const translatedText = await translateChunk(
          textsToTranslate,
          targetLanguage,
          apiUrl
        );

        // Split translated text back into entries
        const translatedTexts = translatedText.split('\n');
        
        // Map translations back to entries
        chunk.forEach((entry, index) => {
          translatedEntries.push({
            ...entry,
            text: translatedTexts[index] || entry.text
          });
        });

        const progress = Math.round(((i + 1) / chunks.length) * 100);
        onProgress(progress);

      } catch (error) {
        console.error(`Error translating chunk ${i + 1}:`, error);
        throw error;
      }
    }
    
    return translatedEntries;
  } catch (error) {
    console.error('Translation process failed:', error);
    throw error;
  }
};