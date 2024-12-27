# SRT Translator Pro v2

## Project Overview

SRT Translator Pro is an enhanced web application that enables batch translation of SRT subtitle files with support for multiple target languages and custom dictionary integration. The application features a professional UI and leverages AI-powered translation for accurate results.

## 🌟 Key Features

- Professional UI with Material Design
- Multi-language simultaneous translation
- Chunked translation for large files
- Custom dictionary with multi-language support
- Real-time progress tracking per language
- Automatic file downloads
- Error recovery and retry mechanism
- Responsive design for all devices

## 🛠 Technology Stack

- Frontend: React with TypeScript
- UI Framework: Material-UI (MUI) v5
- Icons: Material Icons
- Translation API: Anthropic Claude
- State Management: React Hooks
- File Parsing: PapaParse
- Styling: Emotion (CSS-in-JS)

## 📂 Project Structure

```
srt-translator/
│
├── public/
│   └── index.html
│
├── src/
│   ├── components/
│   │   ├── DataDictionaryUploader.tsx
│   │   ├── DataDictionaryTable.tsx
│   │   ├── FileUploader.tsx
│   │   ├── LanguageSelector.tsx
│   │   └── TranslationProgress.tsx
│
│   ├── utils/
│   │   ├── csvParser.ts
│   │   ├── fileHelpers.ts
│   │   ├── srtParser.ts
│   │   └── translator.ts
│
│   ├── types/
│   │   └── index.ts
│
│   └── App.tsx
│
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- npm or Yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/srt-translator.git
cd srt-translator
```

2. Install dependencies
```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install
```

3. Start the development server
```bash
npm start
```

## 📝 Custom Dictionary CSV Format

The custom dictionary now supports multiple target languages. Format:

```csv
term,es,fr,de,it
hello,hola,bonjour,hallo,ciao
goodbye,adiós,au revoir,auf wiedersehen,arrivederci
```

- `term`: Original term to replace
- `es`: Spanish translation
- `fr`: French translation
- `de`: German translation
- `it`: Italian translation

## 🔍 How It Works

1. Upload an SRT file
2. Select multiple target languages
3. (Optional) Upload a multi-language custom dictionary CSV
4. Click "Start Translation"
5. Monitor progress for each language
6. Automatic download of translated files

## ⚡ Technical Features

- Chunked Translation
  - Breaks large files into manageable chunks
  - Configurable chunk size (default: 10 entries)
  - Progress tracking per chunk
  - Automatic retry mechanism

- Error Handling
  - Retry mechanism with exponential backoff
  - Detailed error reporting per language
  - Graceful failure recovery
  - User-friendly error messages

- Performance
  - Optimized for large files
  - Efficient memory usage
  - Parallel language processing
  - Progress caching

## 🎯 Use Cases

- Professional subtitle translation
- Batch processing of multiple languages
- Custom terminology management
- Corporate content localization
- Media production workflows

## 🔒 Security & Performance

- Chunked processing for large files
- Secure API communication
- Rate limiting and retry mechanisms
- Progress persistence
- Error recovery
- Memory optimization

## 🔄 Version History

### v2.0.0
- Added multi-language support
- Implemented chunked translation
- Enhanced UI with Material Design
- Added progress tracking per language
- Improved error handling
- Added retry mechanism
- Enhanced custom dictionary support

### v1.0.0
- Initial release with basic translation features

## 📋 Future Enhancements

- Additional language support
- Custom chunk size configuration
- Translation memory
- Batch file processing
- Advanced dictionary management
- Cloud storage integration
