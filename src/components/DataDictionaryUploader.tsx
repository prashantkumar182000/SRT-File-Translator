// src/components/DataDictionaryUploader.tsx
import React, { useState } from 'react';
import { 
  Button, 
  Typography, 
  Box, 
  Paper,
  Alert
} from '@mui/material';
import { parseCSV } from '../utils/csvParser';
import { DataDictionaryEntry, Language } from '../types';

interface DataDictionaryUploaderProps {
  onUpload: (entries: DataDictionaryEntry[]) => void;
  selectedLanguages: Language[];
}

const DataDictionaryUploader: React.FC<DataDictionaryUploaderProps> = ({ 
  onUpload,
  selectedLanguages 
}) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.csv')) {
        setError('Please upload a CSV file');
        return;
      }

      try {
        const entries = await parseCSV(file, selectedLanguages);
        setFileName(file.name);
        setError(null);
        onUpload(entries);
      } catch (error) {
        console.error('CSV parsing error', error);
        setError('Failed to parse CSV file. Please check the format.');
      }
    }
  };

  return (
    <Box>
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Custom Dictionary
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="contained"
            component="label"
          >
            Upload CSV
            <input
              type="file"
              hidden
              accept=".csv"
              onChange={handleFileUpload}
            />
          </Button>
          {fileName && (
            <Typography variant="body2" color="success.main">
              ✓ {fileName}
            </Typography>
          )}
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          CSV should contain columns: term, {selectedLanguages.join(', ')}
        </Typography>
      </Paper>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default DataDictionaryUploader;