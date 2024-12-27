// src/components/Summary.tsx
import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Chip,
  Grid,
  Divider,
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Translate as TranslateIcon,
  Book as DictionaryIcon,
  Description as FileIcon,
  Info as InfoIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { Language, UploadType, TranslationStatus, SrtFile } from '../types';

interface SummaryProps {
  uploadType: UploadType;
  files: SrtFile[];
  selectedLanguages: Language[];
  dictionaryEntries: number;
  fileStatuses: Map<string, Map<Language, TranslationStatus>>;
  isTranslating: boolean;
}

const Summary: React.FC<SummaryProps> = ({
  uploadType,
  files,
  selectedLanguages,
  dictionaryEntries,
  fileStatuses,
  isTranslating
}) => {
  const calculateTotalSize = (): string => {
    const totalBytes = files.reduce((sum, file) => sum + file.content.length, 0);
    if (totalBytes < 1024) return `${totalBytes} B`;
    if (totalBytes < 1024 * 1024) return `${(totalBytes / 1024).toFixed(1)} KB`;
    return `${(totalBytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getCompletedFiles = (): number => {
    let completed = 0;
    fileStatuses.forEach(languageStatuses => {
      const allCompleted = Array.from(languageStatuses.values())
        .every(status => status.status === 'completed');
      if (allCompleted) completed++;
    });
    return completed;
  };

  const getEstimatedTime = (): string => {
    const averageTimePerFile = 30; // seconds per file per language
    const totalFiles = files.length;
    const totalLanguages = selectedLanguages.length;
    const totalSeconds = totalFiles * totalLanguages * averageTimePerFile;
    
    if (totalSeconds < 60) return `${totalSeconds}s`;
    if (totalSeconds < 3600) return `${Math.round(totalSeconds / 60)}m`;
    return `${Math.round(totalSeconds / 3600)}h ${Math.round((totalSeconds % 3600) / 60)}m`;
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Translation Summary
        </Typography>
        {isTranslating && (
          <Chip 
            label="Translating..."
            color="primary"
            size="small"
            icon={<ScheduleIcon />}
          />
        )}
      </Box>

      <Grid container spacing={2}>
        {/* Upload Information */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <UploadIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="subtitle2">Upload Details</Typography>
          </Box>
          <Box sx={{ pl: 4, mb: 2 }}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Type:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Chip 
                  label={uploadType.charAt(0).toUpperCase() + uploadType.slice(1)}
                  size="small"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Total Size:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">{calculateTotalSize()}</Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        {/* Files Information */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <FileIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="subtitle2">Files</Typography>
          </Box>
          <Box sx={{ pl: 4, mb: 2 }}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Total Files:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Chip 
                  label={files.length}
                  size="small"
                  color="primary"
                />
              </Grid>
              {fileStatuses.size > 0 && (
                <>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Completed:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Chip 
                      label={`${getCompletedFiles()}/${files.length}`}
                      size="small"
                      color="success"
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        {/* Languages Information */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TranslateIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="subtitle2">Languages</Typography>
          </Box>
          <Box sx={{ pl: 4, mb: 1 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selectedLanguages.map(lang => (
                <Chip 
                  key={lang}
                  label={lang.toUpperCase()}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        {/* Dictionary Information */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <DictionaryIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="subtitle2">Dictionary</Typography>
          </Box>
          <Box sx={{ pl: 4 }}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Entries:
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Chip 
                  label={dictionaryEntries}
                  size="small"
                  color={dictionaryEntries > 0 ? 'success' : 'default'}
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* Estimated Time */}
        {files.length > 0 && selectedLanguages.length > 0 && (
          <>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ScheduleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="subtitle2">Estimated Time</Typography>
                <Tooltip title="Estimated time may vary based on file sizes and network conditions">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ pl: 4 }}>
                <Typography variant="body2">
                  Approximately {getEstimatedTime()}
                </Typography>
              </Box>
            </Grid>
          </>
        )}
      </Grid>
    </Paper>
  );
};

export default Summary;