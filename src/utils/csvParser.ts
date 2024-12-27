// src/utils/csvParser.ts
import Papa from 'papaparse';
import { DataDictionaryEntry, Language } from '../types';

export const parseCSV = (file: File, selectedLanguages: Language[]): Promise<DataDictionaryEntry[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          if (!results.data || !Array.isArray(results.data)) {
            throw new Error('Invalid CSV format');
          }

          const entries: DataDictionaryEntry[] = results.data
            .filter((row: any) => row.term && typeof row.term === 'string')
            .map((row: any) => {
              const translations: { [key in Language]?: string } = {};
              
              selectedLanguages.forEach(lang => {
                if (row[lang] && typeof row[lang] === 'string') {
                  translations[lang] = row[lang].trim();
                }
              });
              
              return {
                term: row.term.trim(),
                translations
              };
            });
          
          resolve(entries);
        } catch (error) {
          reject(error instanceof Error ? error : new Error('Failed to parse CSV'));
        }
      },
      error: (error: Error) => {
        reject(error);
      }
    });
  });
};