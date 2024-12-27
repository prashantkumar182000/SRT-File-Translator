// src/components/FileList.tsx
import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Paper,
  Typography
} from '@mui/material';
import {
  Description as FileIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { SrtFile } from '../types';

interface FileListProps {
  files: SrtFile[];
  onRemove: (fileId: string) => void;
}

const FileList: React.FC<FileListProps> = ({ files, onRemove }) => {
  if (files.length === 0) return null;

  return (
    <Paper sx={{ mt: 2, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Files to Translate ({files.length})
      </Typography>
      <List>
        {files.map((file) => (
          <ListItem
            key={file.id}
            secondaryAction={
              <IconButton 
                edge="end" 
                aria-label="delete"
                onClick={() => onRemove(file.id)}
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
              secondary={file.path}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default FileList;