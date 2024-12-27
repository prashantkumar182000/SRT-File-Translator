// src/types/custom.d.ts
declare module '*.css';

interface CustomHTMLInputElement extends HTMLInputElement {
  webkitdirectory: boolean;
  directory: boolean;
  files: FileList;
}

interface CustomFile extends File {
  webkitRelativePath?: string;
}

interface FileSystemEntry {
  isFile: boolean;
  isDirectory: boolean;
  name: string;
}

interface FileSystemFileEntry extends FileSystemEntry {
  file(callback: (file: File) => void): void;
}

interface FileSystemDirectoryEntry extends FileSystemEntry {
  createReader(): FileSystemDirectoryReader;
}

interface FileSystemDirectoryReader {
  readEntries(callback: (entries: FileSystemEntry[]) => void): void;
}

interface DataTransferItem {
  webkitGetAsEntry(): FileSystemEntry | null;
}