# AI-Powered Localization Service

This service provides AI-powered localization capabilities for text, PDFs, and images using Azure AI services.

## Features

- Process text, PDF, and image inputs
- Automatic language detection
- Smart translation routing
- Content localization with Azure OpenAI
- Image analysis and captioning
- Cultural relevance checking

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=3000

# Azure Form Recognizer
AZURE_FORM_RECOGNIZER_ENDPOINT=your_form_recognizer_endpoint
AZURE_FORM_RECOGNIZER_KEY=your_form_recognizer_key

# Azure Translator
AZURE_TRANSLATOR_ENDPOINT=your_translator_endpoint
AZURE_TRANSLATOR_KEY=your_translator_key

# Azure Computer Vision
AZURE_VISION_ENDPOINT=your_vision_endpoint
AZURE_VISION_KEY=your_vision_key

# Azure OpenAI
AZURE_OPENAI_ENDPOINT=your_openai_endpoint
AZURE_OPENAI_KEY=your_openai_key
AZURE_OPENAI_DEPLOYMENT_NAME=your_deployment_name
```

3. Start the server:
```bash
npm start
```

## API Endpoints

### POST /api/localization/process

Process and localize content from text, PDF, or image.

**Request:**
- For text: Send as form data with `type=text` and `text=your_text`
- For files: Send as form data with file in `file` field
- Include `preferredLanguage` in the request body

**Response:**
```json
{
    "text": ["extracted text"],
    "detectedLanguage": "en",
    "processedContent": {
        "processedText": "localized content",
        "language": "en"
    },
    "finalContent": {
        "text": "translated content",
        "language": "target_language"
    }
}
```

## Supported Languages

The service supports the following Southeast Asian (SEA) languages for OpenAI processing:
- English (en) - Commonly used in SEA
- Indonesian (id)
- Malay (ms)
- Thai (th)
- Vietnamese (vi)
- Filipino (fil)
- Khmer (km)
- Lao (lo)
- Burmese (my)
- Chinese (zh) - For Singapore and Malaysia
- Tamil (ta) - For Singapore
- Hindi (hi) - For Singapore

For other languages, the content will be translated to English for processing and then translated back to the preferred language.
