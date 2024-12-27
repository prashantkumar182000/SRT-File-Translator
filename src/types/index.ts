// src/types/index.ts
export type Language = 'es' | 'fr' | 'de' | 'it';
export type UploadType = 'single' | 'folder' | 'zip';

export interface SrtEntry {
  id: number;
  startTime: string;
  endTime: string;
  text: string;
}

export interface SrtFile {
  id: string;
  name: string;
  content: string;
  path?: string;
}

export interface DataDictionaryEntry {
  term: string;
  translations: {
    [key in Language]?: string;
  };
}

export interface TranslationStatus {
  fileId: string;
  fileName: string;
  progress: number;
  status: 'pending' | 'translating' | 'completed' | 'error';
  error?: string;
}

export interface TranslationResult {
  fileId: string;
  fileName: string;
  translations: Map<Language, string>;
  originalPath?: string;  // Added this field
  path?: string;         // Added this field for compatibility
}