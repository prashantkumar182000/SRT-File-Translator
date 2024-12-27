// src/utils/translationManager.ts
import { 
    Language, 
    SrtFile, 
    TranslationStatus, 
    TranslationResult,
    SrtEntry 
  } from '../types';
  import { parseSrt, formatSrt } from './srtParser';
  
  const API_URL = '';
  const MAX_RETRIES = 3;
  const INITIAL_RETRY_DELAY = 500; // Reduced from 1000ms to 500ms
  const MAX_RETRY_DELAY = 5000; // Reduced from 10000ms to 5000ms
  const BATCH_SIZE = 8; // Increased from 5 to 8 for better speed
  const CONCURRENT_BATCHES = 3; // Number of batches to process concurrently
  
  interface TranslationChunk {
    index: number;
    entries: SrtEntry[];
    retryCount: number;
    originalText: string[];
  }
  
  export class TranslationManager {
    private fileStatuses: Map<string, Map<Language, TranslationStatus>>;
    private onStatusUpdate: (statuses: Map<string, Map<Language, TranslationStatus>>) => void;
    private translationLog: string[] = [];
  
    constructor(
      onStatusUpdate: (statuses: Map<string, Map<Language, TranslationStatus>>) => void
    ) {
      this.fileStatuses = new Map();
      this.onStatusUpdate = onStatusUpdate;
    }
  
    private log(message: string) {
      const timestamp = new Date().toISOString();
      const logMessage = `[${timestamp}] ${message}`;
      this.translationLog.push(logMessage);
      console.log(logMessage);
    }
  
    private updateStatus(
      fileId: string,
      language: Language,
      update: Partial<TranslationStatus> & { fileName?: string }
    ): void {
      let fileStatus = this.fileStatuses.get(fileId);
      if (!fileStatus) {
        fileStatus = new Map();
        this.fileStatuses.set(fileId, fileStatus);
      }
  
      const currentStatus = fileStatus.get(language) || {
        fileId,
        fileName: update.fileName || '',
        progress: 0,
        status: 'pending'
      };
  
      fileStatus.set(language, { 
        ...currentStatus, 
        ...update 
      } as TranslationStatus);
      
      this.onStatusUpdate(new Map(this.fileStatuses));
    }
  
    private async sleep(ms: number): Promise<void> {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  
    private async retryWithExponentialBackoff<T>(
      operation: () => Promise<T>,
      context: string,
      retryCount: number = 0
    ): Promise<T> {
      try {
        return await operation();
      } catch (error) {
        if (retryCount >= MAX_RETRIES) {
          this.log(`${context} - Max retries reached. Final error: ${error}`);
          throw error;
        }
  
        const delay = Math.min(
          INITIAL_RETRY_DELAY * Math.pow(2, retryCount),
          MAX_RETRY_DELAY
        );
        
        this.log(`${context} - Retry attempt ${retryCount + 1} after ${delay}ms`);
        await this.sleep(delay);
        
        return this.retryWithExponentialBackoff(operation, context, retryCount + 1);
      }
    }
  
    async translateFiles(
      files: SrtFile[],
      languages: Language[]
    ): Promise<TranslationResult[]> {
      const results: TranslationResult[] = [];
  
      for (const file of files) {
        this.log(`Starting translation for file: ${file.name}`);
        try {
          const entries = parseSrt(file.content);
          const translations = new Map<Language, string>();
  
          for (const language of languages) {
            this.log(`Translating ${file.name} to ${language}`);
            this.updateStatus(file.id, language, {
              fileName: file.name,
              status: 'translating',
              progress: 0
            });
  
            try {
              const translatedEntries = await this.translateEntries(
                entries,
                language,
                file.name,
                (progress) => this.updateStatus(file.id, language, { progress })
              );
  
              const translatedContent = formatSrt(translatedEntries);
              translations.set(language, translatedContent);
  
              this.updateStatus(file.id, language, {
                status: 'completed',
                progress: 100
              });
              this.log(`Successfully translated ${file.name} to ${language}`);
            } catch (error) {
              this.log(`Error translating ${file.name} to ${language}: ${error}`);
              this.updateStatus(file.id, language, {
                status: 'error',
                error: 'Translation failed. Retrying...'
              });
  
              try {
                const translatedEntries = await this.translateEntries(
                  entries,
                  language,
                  file.name,
                  (progress) => this.updateStatus(file.id, language, { progress })
                );
  
                const translatedContent = formatSrt(translatedEntries);
                translations.set(language, translatedContent);
  
                this.updateStatus(file.id, language, {
                  status: 'completed',
                  progress: 100
                });
                this.log(`Successfully translated ${file.name} to ${language} after retry`);
              } catch (retryError) {
                this.updateStatus(file.id, language, {
                  status: 'error',
                  error: 'Translation failed after retries'
                });
                throw retryError;
              }
            }
          }
  
          results.push({
            fileId: file.id,
            fileName: file.name,
            translations,
            originalPath: file.path
          });
        } catch (error) {
          this.log(`Failed to process file ${file.name}: ${error}`);
        }
      }
  
      return results;
    }
  
    private async translateEntries(
      entries: SrtEntry[],
      language: Language,
      fileName: string,
      onProgress: (progress: number) => void
    ): Promise<SrtEntry[]> {
      const chunks: TranslationChunk[] = this.createChunks(entries);
      const translatedEntries: SrtEntry[] = new Array(entries.length);
      let completedChunks = 0;
  
      this.log(`Created ${chunks.length} chunks for ${fileName}`);
  
      // Process chunks in parallel with limited concurrency
      for (let i = 0; i < chunks.length; i += CONCURRENT_BATCHES) {
        const batchChunks = chunks.slice(i, i + CONCURRENT_BATCHES);
        const chunkPromises = batchChunks.map(chunk => 
          this.processChunk(chunk, language, fileName)
            .then(translatedTexts => {
              // Update translated entries
              chunk.entries.forEach((entry, index) => {
                translatedEntries[chunk.index + index] = {
                  ...entry,
                  text: translatedTexts[index]
                };
              });
              completedChunks++;
              const progress = Math.round((completedChunks / chunks.length) * 100);
              onProgress(progress);
            })
        );
  
        await Promise.all(chunkPromises);
        
        // Small delay between batch processing
        if (i + CONCURRENT_BATCHES < chunks.length) {
          await this.sleep(500);
        }
      }
  
      return translatedEntries.filter(Boolean);
    }
  
    private createChunks(entries: SrtEntry[]): TranslationChunk[] {
      const chunks: TranslationChunk[] = [];
      for (let i = 0; i < entries.length; i += BATCH_SIZE) {
        const batchEntries = entries.slice(i, i + BATCH_SIZE);
        chunks.push({
          index: i,
          entries: batchEntries,
          retryCount: 0,
          originalText: batchEntries.map(entry => entry.text)
        });
      }
      return chunks;
    }
  
    private async processChunk(
      chunk: TranslationChunk,
      language: Language,
      fileName: string
    ): Promise<string[]> {
      const chunkContext = `File: ${fileName}, Chunk ${chunk.index}-${chunk.index + chunk.entries.length}`;
      this.log(`Processing ${chunkContext}`);
  
      try {
        const translatedTexts = await Promise.all(
          chunk.entries.map((entry, index) =>
            this.retryWithExponentialBackoff(
              async () => {
                try {
                  const translatedText = await this.translateText(entry.text, language);
                  this.log(`Successfully translated subtitle ${chunk.index + index}`);
                  return translatedText;
                } catch (error) {
                  this.log(`Failed to translate subtitle ${chunk.index + index}: ${entry.text}`);
                  throw error;
                }
              },
              `${chunkContext}, Subtitle ${index + 1}`
            )
          )
        );
  
        return translatedTexts;
      } catch (error) {
        this.log(`Failed to process chunk after all retries: ${chunkContext}`);
        this.log(`Original texts: ${JSON.stringify(chunk.originalText, null, 2)}`);
        throw error;
      }
    }
  
    private async translateText(text: string, language: Language): Promise<string> {
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            target_language: language
          })
        });
  
        if (!response.ok) {
          throw new Error(`Translation failed: ${response.statusText}`);
        }
  
        const data = await response.json();
        return data.translated_text;
      } catch (error) {
        throw new Error(`Failed to translate text: ${error}`);
      }
    }
  
    // Method to get translation logs
    getTranslationLogs(): string[] {
      return [...this.translationLog];
    }
  
    // Method to clear logs
    clearLogs(): void {
      this.translationLog = [];
    }
  }