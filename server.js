// server.js
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import bodyParser from 'body-parser';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

const LAMBDA_URL = '';

app.post('/translate', async (req, res) => {
  try {
    console.log('Received translation request:', req.body);
    
    const response = await fetch(LAMBDA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)
    });

    if (!response.ok) {
      throw new Error(`Lambda returned status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Translation response:', data);
    
    if (!data.translated_text) {
      throw new Error('Invalid response format from Lambda');
    }

    res.json(data);
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ 
      error: error.message || 'Translation failed',
      details: error.toString()
    });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});