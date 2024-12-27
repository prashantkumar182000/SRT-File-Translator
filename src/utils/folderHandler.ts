// src/utils/folderHandler.ts
import { SrtFile } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

export const handleFolderContents = async (fileList: FileList): Promise<SrtFile[]> => {
  const files: SrtFile[] = [];
  
  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i] as File & { webkitRelativePath?: string };
    if (file.name.toLowerCase().endsWith('.srt')) {
      try {
        const content = await readFileAsText(file);
        files.push({
          id: uuidv4(),
          name: file.name,
          content,
          path: file.webkitRelativePath || file.name
        });
      } catch (error) {
        console.error(`Error reading file ${file.name}:`, error);
      }
    }
  }
  
  return files;
};