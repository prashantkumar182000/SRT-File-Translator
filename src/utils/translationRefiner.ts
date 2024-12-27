// src/utils/translationRefiner.ts
import { DataDictionaryEntry, Language, SrtEntry } from '../types';

export const refineTranslation = (
  srtEntries: SrtEntry[], 
  dataDictionary: DataDictionaryEntry[],
  language: Language
): SrtEntry[] => {
  return srtEntries.map(entry => {
    let refinedText = entry.text;
    
    dataDictionary.forEach(dictEntry => {
      if (dictEntry.translations[language]) {
        const regex = new RegExp(dictEntry.term, 'gi');
        refinedText = refinedText.replace(regex, dictEntry.translations[language]!);
      }
    });
    
    return {
      ...entry,
      text: refinedText
    };
  });
};