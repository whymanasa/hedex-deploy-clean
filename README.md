# Hedex - Multilingual Content Processing Platform
With teh hope to make learners feel "Built for me".

link--> https://hedex-deploy-clean.onrender.com (will take some time to load, be patient T_T)

Hedex is a powerful web application that helps users process and understand content in multiple languages. It provides features for translation, summarization, and content analysis with support for various languages.

## Features

- **Translation**: Translate content between multiple languages
- **Summarization**: Generate concise summaries of content
- **PDF Processing**: Upload and process PDF files
- **Multilingual Support**: Supports 19 languages including:
  - Bengali (bn)
  - Chinese (zh, zh-hk, zh-tw)
  - English (en)
  - Filipino (fil)
  - Hindi (hi)
  - Indonesian (id)
  - Khmer (km)
  - Lao (lo)
  - Malay (ms)
  - Burmese (my)
  - Punjabi (pa)
  - Tamil (ta)
  - Telugu (te)
  - Thai (th)
  - Tagalog (tl)
  - Urdu (ur)
  - Vietnamese (vi)

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- i18next for internationalization
- Axios for API requests
- jsPDF for PDF generation
- html2canvas for content rendering

### Backend
- Node.js with Express
- Azure OpenAI API for content processing
- Multer for file uploads
- Node-cache for response caching
- CORS enabled for cross-origin requests

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Azure OpenAI API key and endpoint
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/whymanasa/hedex-deploy-clean.git
cd hedex-deploy-clean
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
AZURE_OPENAI_KEY=your_azure_openai_key
AZURE_OPENAI_ENDPOINT=your_azure_openai_endpoint
AZURE_OPENAI_DEPLOYMENT=your_deployment_name
AZURE_OPENAI_API_VERSION=your_api_version
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend development server:
```bash
cd client
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Translation
- `POST /translate`
  - Accepts text content or PDF file
  - Returns translated content in the preferred language

### Summarization
- `POST /summarize`
  - Accepts text content or PDF file
  - Returns a concise summary in the preferred language

### Question Generation
- `POST /create-questions`
  - Accepts text content
  - Returns multiple-choice questions based on the content

### Review Generation
- `POST /review-maker`
  - Accepts score and language
  - Returns personalized feedback in the specified language

### Document Download
- `POST /download-docx`
  - Accepts content
  - Returns a downloadable DOCX file

## Error Handling

The application includes comprehensive error handling for:
- Missing required fields
- Unsupported languages
- File processing errors
- API request failures
- Network issues
- Browser extension interference

## Caching

The application implements caching for:
- Translations
- Summaries
- Questions
- Reviews
- Document generation

Cache duration:
- Quiz/Questions: 1 hour
- Feedback/Reviews: 10 minutes
- Summaries: 1 hour
- DOCX: 1 hour

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## Acknowledgments

- Azure OpenAI for providing the AI capabilities
- The open-source community for the various libraries used
- All contributors who have helped improve the project
