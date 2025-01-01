# SRT Translator Pro v3

## Project Overview

SRT Translator Pro v3 is a professional-grade web application for batch translation of SRT subtitle files. This latest version introduces advanced features including folder/zip upload support, enhanced progress tracking, and improved translation reliability. The application maintains its core strengths of multi-language support and custom dictionary integration while adding sophisticated batch processing capabilities.

## 🌟 New Features in v3

- **Advanced File Upload Options**
  - Single SRT file upload
  - Folder upload with multiple SRT files
  - Zip file upload containing multiple SRT files
  - Maintains folder structure in outputs

- **Enhanced Progress Tracking**
  - Real-time progress monitoring per file and language
  - Overall progress calculation based on selected languages
  - Detailed status updates with completion percentages
  - Visual progress indicators with status chips

- **Improved Translation Engine**
  - Robust retry mechanism with exponential backoff
  - Concurrent batch processing
  - Smart chunking system
  - Translation caching for improved performance

- **Advanced Status Monitoring**
  - Detailed metrics and statistics
  - Translation logs and error tracking
  - File-specific progress tracking
  - Language-specific status updates

## 🛠 Technology Stack

- Frontend: React 18 with TypeScript
- UI Framework: Material-UI (MUI) v5
- State Management: React Hooks
- Translation API: Anthropic Claude
- File Processing: JSZip for zip handling
- CSV Parsing: PapaParse
- Styling: Emotion (CSS-in-JS)

## 📂 Project Structure

```
srt-translator-v3/
│
├── src/
│   ├── components/
│   │   ├── FileUploader/
│   │   │   ├── SingleFileUpload.tsx
│   │   │   ├── FolderUpload.tsx
│   │   │   └── ZipUpload.tsx
│   │   ├── Progress/
│   │   │   ├── TranslationProgress.tsx
│   │   │   ├── DetailedProgress.tsx
│   │   │   └── TranslationMetrics.tsx
│   │   ├── Dictionary/
│   │   │   ├── DictionaryUploader.tsx
│   │   │   └── DictionaryTable.tsx
│   │   └── Common/
│   │       ├── LanguageSelector.tsx
│   │       └── StatusChip.tsx
│   │
│   ├── utils/
│   │   ├── translationManager.ts
│   │   ├── fileHandlers.ts
│   │   ├── srtParser.ts
│   │   └── progressCalculator.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   └── App.tsx
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm or Yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/srt-translator-v3.git
cd srt-translator-v3

# Install dependencies
npm install

# Start the development server
npm start
```

## 📝 Features Deep Dive

### 1. Advanced File Upload System
- **Single File Mode**: Traditional single SRT file upload
- **Folder Mode**: Upload entire folders containing multiple SRT files
- **Zip Mode**: Upload zip archives containing SRT files
- Maintains original folder structure in translations
- Automatic file type validation
- Progress tracking for each upload type

### 2. Enhanced Translation Engine
- **Smart Chunking**
  - Optimized chunk size for better performance
  - Concurrent batch processing
  - Automatic retry mechanism
  - Translation caching

- **Error Handling**
  - Exponential backoff retry strategy
  - Detailed error logging
  - Per-file and per-language error tracking
  - Automatic recovery mechanisms

### 3. Progress Tracking System
- **Granular Progress Monitoring**
  - File-level progress tracking
  - Language-specific progress
  - Overall translation progress
  - Estimated completion time

- **Visual Feedback**
  - Progress bars with status indicators
  - Status chips for each stage
  - Error indicators with detailed messages
  - Success notifications

### 4. Download Management
- **Format-Specific Downloads**
  - Single file downloads
  - Folder structure preservation
  - Zip file creation for batch downloads
  - Automatic file naming conventions

## 🔍 Use Cases

- **Media Production Companies**
  - Batch process multiple subtitle files
  - Maintain folder organization
  - Track progress across multiple projects

- **Localization Teams**
  - Process multiple languages simultaneously
  - Custom dictionary implementation
  - Quality control through progress monitoring

- **Content Creators**
  - Simple single file translations
  - Multiple language support
  - Easy progress tracking

## 🔒 Security & Performance

- Secure file handling
- Client-side processing where possible
- Efficient memory management
- Rate limiting protection
- Progress persistence
- Error recovery systems

## 📈 Version History

### v3.0.0 (Current)
- Added folder and zip file upload support
- Enhanced progress tracking system
- Implemented concurrent batch processing
- Added translation metrics and logging
- Improved error handling and recovery
- Enhanced user interface and feedback

### v2.0.0
- Multi-language support
- Basic chunked translation
- Material Design UI
- Progress tracking
- Custom dictionary support

### v1.0.0
- Initial release with basic translation features

## 🔄 Future Roadmap

- Cloud storage integration
- Advanced translation memory system
- API rate limiting configuration
- Custom chunk size settings
- Batch operation controls (pause/resume/cancel)
- Advanced dictionary management
- Translation quality metrics
- Custom language model selection

## 📋 Support

For support, please visit our [documentation](https://docs.srttranslator.com) or contact [Prashant Kumar](https://prashantkumar60099.netlify.app/).

## 🤝 Contributing

We welcome contributions! [Connect with us](https://prashantkumar60099.netlify.app/) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Note: This is a professional translation tool designed for high-volume subtitle translation needs. For optimal performance, please follow the recommended usage guidelines in our documentation.*
