/// <reference types="react-scripts" />

declare namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_API_URL: string;
      REACT_APP_MAX_FILE_SIZE: string;
      REACT_APP_ALLOWED_FILE_TYPES: string;
      REACT_APP_ENV: 'development' | 'production' | 'test';
      REACT_APP_VERSION: string;
    }
  }