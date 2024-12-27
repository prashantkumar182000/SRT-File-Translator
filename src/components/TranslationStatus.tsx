// src/components/TranslationStatus.tsx
import React from 'react';
import { Box, Typography, LinearProgress, Paper } from '@mui/material';
import { Language } from '../types';

interface TranslationStatusProps {
    language: Language;
    progress: number;
    error?: string | null;
  }
  
const TranslationStatus: React.FC<TranslationStatusProps> = ({
  language,
  progress,
  error
}) => {
  const getStatusText = () => {
    if (error) return `Error: ${error}`;
    if (progress === 100) return 'Completed';
    if (progress > 0) return `Progress: ${progress}%`;
    return 'Pending';
  };

  return (
    <Paper sx={{ p: 2, mb: 1 }}>
      <Typography variant="subtitle2" gutterBottom>
        {language.toUpperCase()} Translation
      </Typography>
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        color={error ? 'error' : 'primary'}
        sx={{ mb: 1 }}
      />
      <Typography variant ="caption" color={error ? 'error' : 'text.secondary'}>
        {getStatusText()}
      </Typography>
    </Paper>
  );
};

export default TranslationStatus;