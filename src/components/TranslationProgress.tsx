// src/components/TranslationProgress.tsx
import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Chip,
  Tooltip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Language, TranslationStatus } from '../types';

interface TranslationProgressProps {
  fileStatuses: Map<string, Map<Language, TranslationStatus>>;
  selectedLanguages: Language[]; // Add this prop
}

const TranslationProgress: React.FC<TranslationProgressProps> = ({ 
  fileStatuses,
  selectedLanguages 
}) => {
  const calculateFileProgress = (languageStatuses: Map<Language, TranslationStatus>): number => {
    if (languageStatuses.size === 0) return 0;

    const totalLanguages = selectedLanguages.length;
    let completedProgress = 0;

    // Calculate progress for each language
    languageStatuses.forEach((status, language) => {
      if (status.status === 'completed') {
        completedProgress += (100 / totalLanguages);
      } else if (status.status === 'translating') {
        completedProgress += (status.progress / totalLanguages);
      }
    });

    return Math.round(completedProgress);
  };

  const getTotalProgress = (): number => {
    if (fileStatuses.size === 0) return 0;
    
    const totalFiles = Array.from(fileStatuses.entries());
    const progressPerFile = 100 / selectedLanguages.length;
    let totalProgress = 0;

    selectedLanguages.forEach((language, index) => {
      // Find the file being processed for this language
      const currentFileIndex = totalFiles.findIndex(([_, langStatuses]) => {
        const langStatus = langStatuses.get(language);
        return langStatus && langStatus.status !== 'completed';
      });

      if (currentFileIndex === -1) {
        // All files for this language are completed
        totalProgress += progressPerFile;
      } else {
        // Calculate progress for current file
        const [_, langStatuses] = totalFiles[currentFileIndex];
        const langStatus = langStatuses.get(language);
        
        if (langStatus) {
          const completedFilesProgress = currentFileIndex * (progressPerFile / totalFiles.length);
          const currentFileProgress = (langStatus.progress / 100) * (progressPerFile / totalFiles.length);
          totalProgress += completedFilesProgress + currentFileProgress;
        }
      }
    });

    return Math.round(totalProgress);
  };

  const getStatusColor = (status: string): "primary" | "error" | "success" | "warning" => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'error':
        return 'error';
      case 'translating':
        return 'primary';
      default:
        return 'warning';
    }
  };

  const getStatusLabel = (status: TranslationStatus): string => {
    switch (status.status) {
      case 'completed':
        return 'Completed';
      case 'error':
        return 'Error';
      case 'translating':
        return `Translating (${status.progress}%)`;
      default:
        return 'Pending';
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      {/* Overall Progress */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Translation Progress
        </Typography>
        
      </Box>

      {/* Individual File Progress */}
      {Array.from(fileStatuses.entries()).map(([fileId, languageStatuses]) => (
        <Accordion key={fileId} sx={{ mb: 1 }}>
          <AccordionSummary 
            expandIcon={<ExpandMoreIcon />}
            sx={{ 
              '&.Mui-expanded': {
                minHeight: 48,
                borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
              }
            }}
          >
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs>
                <Typography>
                  {Array.from(languageStatuses.values())[0]?.fileName || 'File'}
                </Typography>
              </Grid>
              <Grid item>
                <Tooltip title={`${calculateFileProgress(languageStatuses)}% complete`}>
                  <Chip 
                    label={`${calculateFileProgress(languageStatuses)}%`}
                    color={calculateFileProgress(languageStatuses) === 100 ? 'success' : 'primary'}
                    size="small"
                    sx={{ minWidth: 60 }}
                  />
                </Tooltip>
              </Grid>
            </Grid>
          </AccordionSummary>
          
          <AccordionDetails>
            {selectedLanguages.map(language => {
              const status = languageStatuses.get(language);
              if (!status) return null;

              return (
                <Box key={language} sx={{ mb: 2 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 1 
                  }}>
                    <Typography variant="body2">
                      {language.toUpperCase()}
                    </Typography>
                    <Tooltip title={status.error || getStatusLabel(status)}>
                      <Chip
                        label={getStatusLabel(status)}
                        size="small"
                        color={getStatusColor(status.status)}
                        sx={{ minWidth: 80 }}
                      />
                    </Tooltip>
                  </Box>
                  
                  <LinearProgress
                    variant="determinate"
                    value={status.progress}
                    color={getStatusColor(status.status)}
                    sx={{ 
                      height: 8, 
                      borderRadius: 1,
                      bgcolor: 'rgba(0, 0, 0, 0.08)'
                    }}
                  />
                  
                  {status.error && (
                    <Typography 
                      color="error" 
                      variant="caption" 
                      sx={{ 
                        mt: 0.5, 
                        display: 'block',
                        pl: 1
                      }}
                    >
                      Error: {status.error}
                    </Typography>
                  )}
                </Box>
              );
            })}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default TranslationProgress;