//src/components/DownloadButton.tsx:
import React from 'react';
import { Button, CircularProgress } from '@mui/material';

interface DownloadButtonProps {
  loading: boolean;
  onClick: () => void;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ loading, onClick }) => (
  <Button
    variant="contained"
    color="primary"
    fullWidth
    onClick={onClick}
    disabled={loading}
  >
    {loading ? <CircularProgress size={24} /> : 'Translate & Download'}
  </Button>
);

export default DownloadButton;
