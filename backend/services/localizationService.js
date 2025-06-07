import axios from 'axios';
import dotenv from 'dotenv';
import { DocumentAnalysisClient, AzureKeyCredential } from "@azure/ai-form-recognizer";

dotenv.config();

class LocalizationService {
    constructor() {
        // Azure Translator configuration
        this.translatorEndpoint = process.env.AZURE_TRANSLATOR_ENDPOINT;
        this.translatorKey = process.env.AZURE_TRANSLATOR_KEY;
        this.translatorRegion = process.env.AZURE_TRANSLATOR_REGION;
        
        // OpenAI configuration
        this.openAIEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
        this.openAIKey = process.env.AZURE_OPENAI_KEY;
        this.openAIDeployment = process.env.AZURE_OPENAI_DEPLOYMENT;
        this.openAIVersion = process.env.AZURE_OPENAI_API_VERSION;

        // Azure Form Recognizer configuration
        this.formRecognizerEndpoint = process.env.AZURE_FORM_RECOGNIZER_ENDPOINT;
        this.formRecognizerKey = process.env.AZURE_FORM_RECOGNIZER_KEY;
        
        if (this.formRecognizerEndpoint && this.formRecognizerKey) {
            this.formRecognizerClient = new DocumentAnalysisClient(
                this.formRecognizerEndpoint,
                new AzureKeyCredential(this.formRecognizerKey)
            );
        }
    }

    // Language display names for cultural localization
    languageNameMap = {
        'fil': 'Filipino',
        'id': 'Bahasa Indonesia',
        'th': 'Thai',
        'vi': 'Vietnamese',
        'ms': 'Malay',
        'en': 'English',
        'km': 'Khmer',
        'lo': 'Lao',
        'my': 'Burmese',
        'zh': 'Chinese',
        'ta': 'Tamil',
        'hi': 'Hindi'
    };

    // List of languages supported by OpenAI
    openAISupportedLanguages = [
        'en',    // English
        'id',    // Indonesian
        'ms',    // Malay
        'th',    // Thai
        'vi',    // Vietnamese
        'fil',   // Filipino
        'km',    // Khmer
        'lo',    // Lao
        'my',    // Burmese
        'zh',    // Chinese
        'ta',    // Tamil
        'hi'     // Hindi
    ];

    isLanguageSupported(languageCode) {
        return this.openAISupportedLanguages.includes(languageCode);
    }

    async processInput(input, type) {
        try {
            let text;
            switch (type) {
                case 'text':
                    text = input;
                    break;
                case 'pdf':
                    text = await this.extractTextFromPDF(input);
                    break;
                case 'image':
                    text = await this.extractTextFromImage(input);
                    break;
                default:
                    throw new Error('Unsupported input type');
            }

            console.log('Detecting language for text:', text.substring(0, 100) + '...');

            // Detect language using Azure Translator
            const response = await axios({
                baseURL: this.translatorEndpoint,
                url: '/detect',
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': this.translatorKey,
                    'Ocp-Apim-Subscription-Region': this.translatorRegion,
                    'Content-type': 'application/json',
                },
                params: {
                    'api-version': '3.0',
                },
                data: [{ text: text }],
            });

            const detectedLanguage = response.data[0].language;
            console.log('Detected language:', detectedLanguage);

            return {
                text,
                detectedLanguage,
                type
            };
        } catch (error) {
            console.error('Error processing input:', error);
            throw error;
        }
    }

    async translateContent(content, sourceLanguage, targetLanguage) {
        try {
            console.log('Translation request:', {
                sourceLanguage,
                targetLanguage,
                contentLength: content.length
            });

            // First translate the content
            const response = await axios({
                baseURL: this.translatorEndpoint,
                url: '/translate',
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': this.translatorKey,
                    'Ocp-Apim-Subscription-Region': this.translatorRegion,
                    'Content-type': 'application/json',
                },
                params: {
                    'api-version': '3.0',
                    'from': sourceLanguage,
                    'to': targetLanguage,
                },
                data: [{ text: content }],
            });

            const translatedText = response.data[0].translations[0].text;
            console.log('Translation completed:', {
                sourceLanguage,
                targetLanguage,
                translatedTextLength: translatedText.length
            });

            // Then culturally localize it
            const culturallyLocalized = await this.localizeWithOpenAI(translatedText, targetLanguage);
            console.log('Cultural localization completed');

            return {
                content: culturallyLocalized,
                language: targetLanguage
            };
        } catch (error) {
            console.error('Error translating content:', error);
            throw error;
        }
    }

    async localizeWithOpenAI(inputText, targetLanguage) {
        const targetLanguageName = this.languageNameMap[targetLanguage] || targetLanguage;
        console.log('Cultural localization for:', targetLanguageName);

        const systemPrompt = `
You are an expert in educational content localization and adaptation. Your job is to modify academic text so that it resonates culturally, emotionally, and contextually with students in the target region.\n\nYou must:\n1. Replace cultural references with local equivalents:\n   - Trees, plants, and crops with local varieties\n   - Animals with local species\n   - Food items with local dishes\n   - Places and locations with local examples\n   - Names and people with local names\n\n2. Maintain proper formatting:\n   - Keep all headings and subheadings\n   - Preserve numbered and bulleted lists\n   - Maintain paragraph structure\n   - Keep technical terms accurate\n   - Ensure proper line breaks between sections\n\n3. Make the content culturally relevant:\n   - Use local measurement systems if applicable\n   - Reference local weather patterns\n   - Include local examples and scenarios\n   - Use culturally appropriate analogies\n   - Adapt date and number formats to the target locale (e.g., "05/06/2025" to target-specific format, decimal separators, thousands separators).\n\n4. Ensure readability:\n   - Break long paragraphs into smaller ones\n   - Use clear transitions between sections\n   - Maintain consistent formatting\n   - Keep technical terms with their translations in parentheses when first used\n\n5. Maintain a balanced tone and formality:\n   - Avoid overly formal or distant language.\n   - Avoid overly casual or unprofessional language.\n   - Strike a tone that is appropriate for educational content aimed at high school students in the target region.\n\n📌 Example:\nOriginal (English): \"Photosynthesis is the process by which plants like maple and oak trees use sunlight, water, and carbon dioxide to make their own food. Farmers in Canada grow crops that rely on sunlight.\"\n\nLocalized for Philippines:\n\"Ang potosintesis (photosynthesis) ay ang proseso kung saan ang mga halaman tulad ng puno ng mangga at narra ay gumagamit ng sikat ng araw, tubig, at carbon dioxide para makagawa ng sarili nilang pagkain. Ang mga magsasaka sa Pilipinas ay nagtatanim ng palay at gulay na umaasa sa sikat ng araw para lumago.\"\n\nNow, localize the following text for students in ${targetLanguageName}. Maintain all formatting, headings, and technical accuracy while making it culturally relevant:\n`;

        try {
            const response = await axios.post(
                `${this.openAIEndpoint}/openai/deployments/${this.openAIDeployment}/chat/completions?api-version=${this.openAIVersion}`,
                {
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: inputText }
                    ],
                    temperature: 0.7,
                    max_tokens: 2048
                },
                {
                    headers: {
                        'api-key': this.openAIKey,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error('Error in cultural localization:', error);
            throw error;
        }
    }

    async extractTextFromPDF(pdfBuffer) {
        try {
            if (!this.formRecognizerClient) {
                throw new Error("Azure Form Recognizer is not configured");
            }

            console.log('Starting PDF analysis with Form Recognizer...');
            
            // Start the analysis
            const poller = await this.formRecognizerClient.beginAnalyzeDocument(
                "prebuilt-document", // Use the prebuilt document model
                pdfBuffer
            );

            // Wait for the analysis to complete
            const result = await poller.pollUntilDone();
            console.log('PDF analysis completed');

            // Extract text from all pages, including text from images
            let fullText = '';
            for (const page of result.pages) {
                // Extract text from the page
                for (const line of page.lines) {
                    fullText += line.content + '\n';
                }

                // Extract text from images if any
                if (page.images) {
                    for (const image of page.images) {
                        if (image.text) {
                            fullText += image.text + '\n';
                        }
                    }
                }

                fullText += '\n'; // Add extra newline between pages
            }

            return fullText;
        } catch (error) {
            console.error('Error processing PDF:', error);
            throw new Error(`Failed to process PDF: ${error.message}`);
        }
    }

    async extractTextFromImage(imageBuffer) {
        throw new Error("Image OCR not yet implemented.");
    }
}

export default new LocalizationService();
