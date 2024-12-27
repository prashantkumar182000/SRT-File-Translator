//src/components/ApiKeyInput.tsx:
import React from 'react';
import { TextField, Typography, Box } from '@mui/material';

interface ApiKeyInputProps {
  apiKey: string;
  setApiKey: (key: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKey, setApiKey }) => (
  <Box>
    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
      Enter your Anthropic API Key
    </Typography>
    <TextField
      label="Anthropic API Key"
      fullWidth
      margin="normal"
      value={apiKey}
      onChange={(e) => setApiKey(e.target.value)}
      placeholder="Enter your Anthropic API key"
      type="password"
      helperText="Your API key will not be stored and is only used for translation requests"
      InputProps={{
        autoComplete: 'off'
      }}
    />
  </Box>
);

export default ApiKeyInput;