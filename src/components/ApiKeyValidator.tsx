//src/components/ApiKeyValidator.tsx:
import React, { useState } from "react";
import { Button, Typography } from "@mui/material";
import Anthropic from '@anthropic-ai/sdk';

interface Props {
  apiKey: string;
}

const ApiKeyValidator: React.FC<Props> = ({ apiKey }) => {
  const [valid, setValid] = useState<string | null>(null);

  const validateApiKey = async () => {
    try {
      const anthropic = new Anthropic({
        apiKey: apiKey,
      });

      const message = await anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1,
        messages: [{
          role: 'user',
          content: 'Hello'
        }]
      });

      setValid("Valid");
    } catch (error) {
      setValid("Invalid");
    }
  };

  return (
    <div>
      <Button 
        variant="contained" 
        onClick={validateApiKey}
        disabled={!apiKey}
      >
        Check API Key
      </Button>
      {valid && (
        <Typography 
          color={valid === "Valid" ? "success.main" : "error.main"}
          sx={{ mt: 1 }}
        >
          {valid} API Key
        </Typography>
      )}
    </div>
  );
};

export default ApiKeyValidator;