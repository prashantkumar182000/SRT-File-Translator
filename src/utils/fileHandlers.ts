// src/utils/fileHandlers.ts
import { SrtFile, UploadType, TranslationResult, Language } from '../types';
import JSZip from 'jszip';
import { v4 as uuidv4 } from 'uuid';

export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

export const handleSingleFileUpload = async (file: File): Promise<SrtFile[]> => {
  if (!file.name.toLowerCase().endsWith('.srt')) {
    throw new Error('Invalid file type. Only .srt files are allowed.');
  }
  
  const content = await readFileAsText(file);
  return [{
    id: uuidv4(),
    name: file.name,
    content
  }];
};

export const handleFolderUpload = async (fileList: FileList): Promise<SrtFile[]> => {
  const files: SrtFile[] = [];
  
  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i] as File & { webkitRelativePath?: string };
    if (file.name.toLowerCase().endsWith('.srt')) {
      const content = await readFileAsText(file);
      files.push({
        id: uuidv4(),
        name: file.name,
        content,
        path: file.webkitRelativePath || file.name
      });
    }
  }

  return files;
};

export const handleZipUpload = async (file: File): Promise<SrtFile[]> => {
  const zip = new JSZip();
  const files: SrtFile[] = [];
  
  try {
    const zipContent = await zip.loadAsync(file);
    
    for (const [path, zipEntry] of Object.entries(zipContent.files)) {
      if (!zipEntry.dir && path.toLowerCase().endsWith('.srt')) {
        const content = await zipEntry.async('string');
        files.push({
          id: uuidv4(),
          name: path.split('/').pop() || path,
          content,
          path
        });
      }
    }
    
    return files;
  } catch (error) {
    throw new Error('Failed to process zip file');
  }
};

export const createDownload = async (
  results: TranslationResult[],
  uploadType: UploadType
): Promise<void> => {
  if (uploadType === 'single') {
    const result = results[0];
    result.translations.forEach((content: string, language: Language) => {
      const blob = new Blob([content], { type: 'text/srt' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${result.fileName.replace('.srt', '')}_${language}.srt`;
      a.click();
      URL.revokeObjectURL(url);
    });
  } else if (uploadType === 'zip') {
    const zip = new JSZip();
    
    results.forEach(result => {
      result.translations.forEach((content: string, language: Language) => {
        const basePath = result.originalPath || result.fileName;
        const newPath = basePath.replace('.srt', `_${language}.srt`);
        zip.file(newPath, content);
      });
    });
    
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translations.zip';
    a.click();
    URL.revokeObjectURL(url);
  } else {
    results.forEach(result => {
      result.translations.forEach((content: string, language: Language) => {
        const blob = new Blob([content], { type: 'text/srt' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const fileName = result.originalPath || result.fileName;
        a.download = `${fileName.replace('.srt', '')}_${language}.srt`;
        a.click();
        URL.revokeObjectURL(url);
      });
    });
  }
};