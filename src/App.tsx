// src/App.tsx
import React, { useState, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Snackbar,
  Alert,
  Grid,
  useTheme,
  CircularProgress
} from '@mui/material';
import {
  Translate as TranslateIcon,
  Download as DownloadIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import FileUploader from './components/FileUploader';
import LanguageSelector from './components/LanguageSelector';
import DataDictionaryUploader from './components/DataDictionaryUploader';
import DataDictionaryTable from './components/DataDictionaryTable';
import TranslationProgress from './components/TranslationProgress';
import Summary from './components/Summary'
import { TranslationManager } from './utils/translationManager';
import { createDownload } from './utils/fileHandlers';
import {
  Language,
  SrtFile,
  UploadType,
  DataDictionaryEntry,
  TranslationStatus,
  TranslationResult
} from './types';

const App: React.FC = () => {
  const theme = useTheme();
  const [files, setFiles] = useState<SrtFile[]>([]);
  const [uploadType, setUploadType] = useState<UploadType>('single');
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>([]);
  const [dataDictionary, setDataDictionary] = useState<DataDictionaryEntry[]>([]);
  const [fileStatuses, setFileStatuses] = useState<Map<string, Map<Language, TranslationStatus>>>(new Map());
  const [translationResults, setTranslationResults] = useState<TranslationResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFilesSelect = useCallback((newFiles: SrtFile[], type: UploadType) => {
    setFiles(newFiles);
    setUploadType(type);
    setFileStatuses(new Map());
    setTranslationResults([]);
    setError(null);
  }, []);

  const handleTranslate = async () => {
    if (files.length === 0) {
      setError('Please upload files to translate');
      return;
    }

    if (selectedLanguages.length === 0) {
      setError('Please select at least one target language');
      return;
    }

    setIsTranslating(true);
    setError(null);

    try {
      const translationManager = new TranslationManager(setFileStatuses);
      const results = await translationManager.translateFiles(files, selectedLanguages);
      setTranslationResults(results);
      setShowSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleDownload = async () => {
    try {
      await createDownload(translationResults, uploadType);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: theme.palette.grey[100], py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mb: 3, 
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            color: 'white'
          }}
        >
          <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CloudUploadIcon fontSize="large" />
            SRT Translator Pro v3
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 1, opacity: 0.9 }}>
            Translate multiple SRT files with custom dictionary support
          </Typography>
        </Paper>

        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} md={8}>
            {/* File Upload Section */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Upload Files
              </Typography>
              <FileUploader onFilesSelect={handleFilesSelect} />
            </Paper>

            {/* Translation Options */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Translation Options
              </Typography>
              <LanguageSelector
                selectedLanguages={selectedLanguages}
                setSelectedLanguages={setSelectedLanguages}
              />
              
              <Box sx={{ mt: 3 }}>
                <DataDictionaryUploader
                  onUpload={setDataDictionary}
                  selectedLanguages={selectedLanguages}
                />
                {dataDictionary.length > 0 && (
                  <DataDictionaryTable
                    entries={dataDictionary}
                    selectedLanguages={selectedLanguages}
                  />
                )}
              </Box>
            </Paper>

            {/* Translation Progress */}
            {fileStatuses.size > 0 && (
              <Paper sx={{ p: 3 }}>
                <TranslationProgress 
                  fileStatuses={fileStatuses} 
                  selectedLanguages={selectedLanguages}
                />
              </Paper>
            )}
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={4}>
            {/* Action Buttons */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                startIcon={isTranslating ? <CircularProgress size={20} color="inherit" /> : <TranslateIcon />}
                onClick={handleTranslate}
                disabled={isTranslating || files.length === 0 || selectedLanguages.length === 0}
                sx={{ mb: 2 }}
              >
                {isTranslating ? 'Translating...' : 'Start Translation'}
              </Button>

              {translationResults.length > 0 && (
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  size="large"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownload}
                >
                  Download Translations
                </Button>
              )}
            </Paper>

            {/* Summary */}
            {files.length > 0 && (
              <Summary
                uploadType={uploadType}
                files={files}
                selectedLanguages={selectedLanguages}
                dictionaryEntries={dataDictionary.length}
                fileStatuses={fileStatuses}
                isTranslating={isTranslating}
              />
            )}
          </Grid>
        </Grid>

        {/* Snackbars */}
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setError(null)}
            severity="error"
            variant="filled"
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={showSuccess}
          autoHideDuration={4000}
          onClose={() => setShowSuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            severity="success"
            variant="filled"
            onClose={() => setShowSuccess(false)}
          >
            Translation completed successfully!
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default App;