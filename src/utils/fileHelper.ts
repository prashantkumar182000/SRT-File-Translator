// src/utils/fileHelpers.ts
export const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('File reading failed'));
      };
      
      reader.readAsText(file);
    });
  };
  
  export const downloadFile = (content: string, filename: string): void => {
    const blob = new Blob([content], { type: 'text/srt' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename.replace('.srt', '_translated.srt');
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  };
  
  export const validateFileType = (file: File): boolean => {
    return file.name.toLowerCase().endsWith('.srt');
  };
  
  export const getFileNameWithoutExtension = (filename: string): string => {
    return filename.replace(/\.[^/.]+$/, '');
  };