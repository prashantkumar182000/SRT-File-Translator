// src/utils/srtParser.ts
import { SrtEntry } from '../types';

export const parseSrt = (content: string): SrtEntry[] => {
  const blocks = content.trim().split(/\n\s*\n/);
  
  return blocks
    .filter(block => block.trim())
    .map((block, index) => {
      const lines = block.trim().split('\n');
      
      if (lines.length < 3) {
        throw new Error(`Invalid SRT block format at block ${index + 1}`);
      }

      const timeMatch = lines[1].match(/(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/);
      
      if (!timeMatch) {
        throw new Error(`Invalid time format at block ${index + 1}`);
      }

      const [, startTime, endTime] = timeMatch;
      const text = lines.slice(2).join('\n').trim();

      return {
        id: index + 1,
        startTime,
        endTime,
        text
      };
    });
};

export const formatSrt = (entries: SrtEntry[]): string => {
  return entries
    .map(entry => (
      `${entry.id}\n${entry.startTime} --> ${entry.endTime}\n${entry.text}`
    ))
    .join('\n\n') + '\n';
};