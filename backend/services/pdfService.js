import { DocumentAnalysisClient, AzureKeyCredential } from "@azure/ai-form-recognizer";
import dotenv from 'dotenv';

dotenv.config();

class PDFService {
    constructor() {
        this.endpoint = process.env.AZURE_FORM_RECOGNIZER_ENDPOINT;
        this.key = process.env.AZURE_FORM_RECOGNIZER_KEY;
        
        if (!this.endpoint || !this.key) {
            console.error('Azure Form Recognizer Configuration:', {
                endpoint: this.endpoint ? 'Configured' : 'Missing',
                key: this.key ? 'Configured' : 'Missing'
            });
            throw new Error("Azure Form Recognizer credentials not found in environment variables");
        }

        try {
            this.client = new DocumentAnalysisClient(
                this.endpoint,
                new AzureKeyCredential(this.key)
            );
            console.log('Azure Form Recognizer client initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Azure Form Recognizer client:', error);
            throw error;
        }
    }

    async extractTextFromPDF(pdfBuffer) {
        try {
            if (!pdfBuffer || !Buffer.isBuffer(pdfBuffer)) {
                throw new Error('Invalid PDF buffer provided');
            }

            console.log('Starting PDF analysis...', {
                bufferSize: pdfBuffer.length,
                endpoint: this.endpoint
            });
            
            // Start the analysis
            const poller = await this.client.beginAnalyzeDocument(
                "prebuilt-document", // Use the prebuilt document model
                pdfBuffer
            );

            console.log('Analysis started, waiting for completion...');

            // Wait for the analysis to complete
            const result = await poller.pollUntilDone();
            console.log('PDF analysis completed successfully');

            if (!result.pages || result.pages.length === 0) {
                console.warn('No pages found in the PDF');
                return '';
            }

            // Extract text from all pages
            let fullText = '';
            for (const page of result.pages) {
                console.log(`Processing page ${page.pageNumber}...`);
                for (const line of page.lines) {
                    fullText += line.content + '\n';
                }
                fullText += '\n'; // Add extra newline between pages
            }

            console.log('Text extraction completed', {
                pageCount: result.pages.length,
                textLength: fullText.length
            });

            return fullText;
        } catch (error) {
            console.error('Error processing PDF:', {
                error: error.message,
                code: error.code,
                details: error.details || 'No additional details'
            });
            throw new Error(`Failed to process PDF: ${error.message}`);
        }
    }
}

export default new PDFService();