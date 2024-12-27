// src/utils/translateSrt.ts
import { Language, SrtEntry, DataDictionaryEntry } from '../types';

const API_URL = '';

export const translateSrtMultiple = async (
  content: string,
  selectedLanguages: Language[],
  dataDictionary: DataDictionaryEntry[],
  onProgress: (language: Language, progress: number) => void
): Promise<Map<Language, string>> => {
  const translations = new Map<Language, string>();

  for (const language of selectedLanguages) {
    try {
      onProgress(language, 0);
      
      // Apply dictionary replacements
      let textToTranslate = content;
      dataDictionary.forEach(entry => {
        if (entry.translations[language]) {
          const regex = new RegExp(entry.term, 'gi');
          textToTranslate = textToTranslate.replace(regex, entry.translations[language]!);
        }
      });

      onProgress(language, 50);

      // Translate
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textToTranslate,
          target_language: language
        })
      });

      if (!response.ok) {
        throw new Error(`Translation failed for ${language}`);
      }

      const data = await response.json();
      translations.set(language, data.translated_text);
      onProgress(language, 100);
    } catch (error) {
      console.error(`Translation error for ${language}:`, error);
      throw error;
    }
  }

  return translations;
};