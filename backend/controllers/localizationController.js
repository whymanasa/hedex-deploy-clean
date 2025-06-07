import localizationService from '../services/localizationService.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

class LocalizationController {
    // Handle file upload and text input
    async processContent(req, res) {
        try {
            const { type, text, preferredLanguage } = req.body;
            let result;

            if (type === 'text' && text) {
                result = await localizationService.processInput(text, 'text');
            } else if (req.file) {
                const fileType = path.extname(req.file.originalname).toLowerCase();
                if (fileType === '.pdf') {
                    result = await localizationService.processInput(req.file.path, 'pdf');
                } else if (['.jpg', '.jpeg', '.png'].includes(fileType)) {
                    result = await localizationService.processInput(req.file.path, 'image');
                } else {
                    return res.status(400).json({ error: 'Unsupported file type' });
                }
            } else {
                return res.status(400).json({ error: 'No content provided' });
            }

            // Check language compatibility
            const sourceLang = result.detectedLanguage || 'en';
            const isSourceSupported = localizationService.isLanguageSupported(sourceLang);
            const isPreferredSupported = localizationService.isLanguageSupported(preferredLanguage);

            if (!isSourceSupported || !isPreferredSupported) {
                return res.status(400).json({ 
                    error: 'Unsupported language combination',
                    details: {
                        sourceSupported: isSourceSupported,
                        preferredSupported: isPreferredSupported
                    }
                });
            }

            res.json(result);
        } catch (error) {
            console.error('Error processing content:', error);
            res.status(500).json({ error: 'Failed to process content' });
        }
    }

    // Helper method to process content with OpenAI
    async processWithOpenAI(content) {
        // Implementation will be added in the next step
        return content;
    }

    // Helper method to translate content
    async translateContent(content, sourceLang, targetLang) {
        // Implementation will be added in the next step
        return content;
    }
}

export default new LocalizationController(); 