// src/utils/downloadHandler.ts
import { TranslationResult, Language, UploadType } from '../types';
import JSZip from 'jszip';

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
            const fileName = `${result.fileName.replace('.srt', '')}_${language}.srt`;
            a.download = fileName;
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
                const fileName = result.originalPath
                    ? `${result.originalPath.replace('.srt', '')}_${language}.srt`
                    : `${result.fileName.replace('.srt', '')}_${language}.srt`;
                a.download = fileName;
                a.click();
                URL.revokeObjectURL(url);
            });
        });
    }
};