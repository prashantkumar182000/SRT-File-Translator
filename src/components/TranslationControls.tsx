// src/components/TranslationControls.tsx
import React from 'react';
import {
    Box,
    Button,
    ButtonGroup,
    Tooltip,
    CircularProgress
} from '@mui/material';
import {
    PlayArrow as PlayIcon,
    Pause as PauseIcon,
    Stop as StopIcon,
    Refresh as RefreshIcon,
    Download as DownloadIcon,
    Translate as TranslateIcon
} from '@mui/icons-material';

interface TranslationControlsProps {
    isTranslating: boolean;
    isPaused: boolean;
    hasResults: boolean;
    disabled: boolean;
    onTranslate: () => void;
    onPauseResume: () => void;
    onCancel: () => void;
    onReset: () => void;
    onDownload: () => void;
}

const TranslationControls: React.FC<TranslationControlsProps> = ({
    isTranslating,
    isPaused,
    hasResults,
    disabled,
    onTranslate,
    onPauseResume,
    onCancel,
    onReset,
    onDownload
}) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                startIcon={isTranslating ? <CircularProgress size={20} color="inherit" /> : <TranslateIcon />}
                onClick={onTranslate}
                disabled={isTranslating || disabled}
            >
                {isTranslating ? 'Translating...' : 'Start Translation'}
            </Button>

            {isTranslating && (
                <ButtonGroup fullWidth variant="outlined">
                    <Tooltip title={isPaused ? 'Resume Translation' : 'Pause Translation'}>
                        <Button
                            onClick={onPauseResume}
                            startIcon={isPaused ? <PlayIcon /> : <PauseIcon />}
                        >
                            {isPaused ? 'Resume' : 'Pause'}
                        </Button>
                    </Tooltip>
                    <Tooltip title="Cancel Translation">
                        <Button
                            color="error"
                            onClick={onCancel}
                            startIcon={<StopIcon />}
                        >
                            Cancel
                        </Button>
                    </Tooltip>
                </ButtonGroup>
            )}

            {hasResults && (
                <>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        startIcon={<DownloadIcon />}
                        onClick={onDownload}
                    >
                        Download Translations
                    </Button>
                    <Button
                        fullWidth
                        variant="text"
                        startIcon={<RefreshIcon />}
                        onClick={onReset}
                    >
                        Reset
                    </Button>
                </>
            )}
        </Box>
    );
};

export default TranslationControls;