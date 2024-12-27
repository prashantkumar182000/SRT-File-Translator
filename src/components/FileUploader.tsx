// src/components/FileUploader.tsx
import React, { useCallback, useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Folder as FolderIcon,
  Archive as ArchiveIcon,
  Description as FileIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { SrtFile, UploadType } from '../types';
import { 
  handleSingleFileUpload, 
  handleFolderUpload, 
  handleZipUpload 
} from '../utils/fileHandlers';

interface FileUploaderProps {
  onFilesSelect: (files: SrtFile[], type: UploadType) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFilesSelect }) => {
  const [files, setFiles] = useState<SrtFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = async (
    selectedFiles: FileList | File[],
    type: UploadType
  ) => {
    try {
      let processedFiles: SrtFile[] = [];
      
      switch (type) {
        case 'single':
          processedFiles = await handleSingleFileUpload(selectedFiles[0] as File);
          break;
        case 'folder':
          processedFiles = await handleFolderUpload(selectedFiles as FileList);
          break;
        case 'zip':
          processedFiles = await handleZipUpload(selectedFiles[0] as File);
          break;
      }

      setFiles(processedFiles);
      onFilesSelect(processedFiles, type);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error processing files');
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFileSelection([acceptedFiles[0]], 'single');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/srt': ['.srt'] },
    multiple: false
  });

  const handleFolderSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.webkitdirectory = true;
    
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files?.length) {
        handleFileSelection(target.files, 'folder');
      }
    };
    
    input.click();
  };

  const removeFile = (fileId: string) => {
    const newFiles = files.filter(f => f.id !== fileId);
    setFiles(newFiles);
    if (newFiles.length > 0) {
      onFilesSelect(newFiles, newFiles.length === 1 ? 'single' : 'folder');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUploadIcon />}
        >
          Single File
          <input
            type="file"
            hidden
            accept=".srt"
            onChange={(e) => {
              const files = e.target.files;
              if (files?.length) {
                handleFileSelection(files, 'single');
              }
            }}
          />
        </Button>

        <Button
          variant="contained"
          onClick={handleFolderSelect}
          startIcon={<FolderIcon />}
        >
          Folder
        </Button>

        <Button
          variant="contained"
          component="label"
          startIcon={<ArchiveIcon />}
        >
          Zip File
          <input
            type="file"
            hidden
            accept=".zip"
            onChange={(e) => {
              const files = e.target.files;
              if (files?.length) {
                handleFileSelection(files, 'zip');
              }
            }}
          />
        </Button>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {files.length > 0 && (
        <Paper sx={{ mt: 2 }}>
          <List>
            {files.map((file) => (
              <ListItem
                key={file.id}
                secondaryAction={
                  <IconButton 
                    edge="end" 
                    onClick={() => removeFile(file.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  <FileIcon />
                </ListItemIcon>
                <ListItemText 
                  primary={file.name}
                  secondary={file.path && `Path: ${file.path}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      <Paper
        {...getRootProps()}
        sx={{
          p: 3,
          mt: 2,
          border: '2px dashed #ccc',
          cursor: 'pointer',
          bgcolor: isDragActive ? 'action.hover' : 'background.paper',
          '&:hover': { borderColor: 'primary.main' }
        }}
      >
        <Typography align="center">
          {isDragActive
            ? "Drop the files here"
            : "Or drag and drop files here"}
        </Typography>
      </Paper>
    </Box>
  );
};

export default FileUploader;