// src/utils/zipHandler.ts
import JSZip from 'jszip';
import { SrtFile } from '../types';

export const createZipFromFiles = async (files: SrtFile[]): Promise<Blob> => {
  const zip = new JSZip();
  
  files.forEach(file => {
    const path = file.path || file.name;
    zip.file(path, file.content);
  });
  
  return await zip.generateAsync({ type: 'blob' });
};

export const extractFilesFromZip = async (zipFile: File): Promise<SrtFile[]> => {
  const zip = new JSZip();
  const files: SrtFile[] = [];
  
  try {
    const zipContent = await zip.loadAsync(zipFile);
    
    for (const [path, zipEntry] of Object.entries(zipContent.files)) {
      if (!zipEntry.dir && path.toLowerCase().endsWith('.srt')) {
        const content = await zipEntry.async('string');
        files.push({
          id: crypto.randomUUID(),
          name: path.split('/').pop() || path,
          content,
          path
        });
      }
    }
    
    return files;
  } catch (error) {
    throw new Error('Failed to extract files from zip');
  }
};