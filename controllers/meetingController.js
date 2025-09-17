const aiService = require('../services/llmService');
const config = require('../config/app');

// Health check endpoint
const healthCheck = (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Server is running'
    });
};

// Main endpoint to process meeting notes
const processMeeting = async (req, res) => {
    try {
        let inputText = '';

        // Handle file upload
        if (req.file) {
            inputText = req.file.buffer.toString('utf-8');
        }
        // Handle raw text input
        else if (req.body) {
            if (typeof req.body === 'string') {
                inputText = req.body;
            } else if (req.body.text) {
                inputText = req.body.text;
            } else {
                return res.status(400).json({
                    error: '.txt file missing or no text passed.Invalid input format.'
                });
            }
        }

        // Validate input
        if (!inputText || inputText.trim().length === 0) {
            return res.status(400).json({
                error: 'Either text file is empty or Raw text body is empty. Please provide valid meeting notes to process.'
            });
        }

        if (inputText.length > config.TEXT_SIZE_LIMIT) {
            return res.status(400).json({
                error: 'Please limit text to 50,000 characters.'
            });
        }

        // Process with AI service
        const result = await aiService.processMeetingNotes(inputText);

        res.status(200).json(result);

    } catch (error) {
        console.error('Error processing meeting:', error.message);

        switch (error.message) {
            case 'Gemini API key is invalid or missing':
                return res.status(401).json({ error: error.message });

            case 'Gemini API quota exceeded or billing issue':
                return res.status(429).json({ error: error.message });

            case 'Gemini API rate limit exceeded':
                return res.status(429).json({ error: error.message });

            case 'Gemini API request timeout':
                return res.status(504).json({ error: error.message });

            case 'AI service returned invalid JSON format':
                return res.status(502).json({ error: error.message });

            default:
                return res.status(500).json({
                    error: 'Internal server error occurred while processing meeting notes.'
                });
        }
    }
};

module.exports = {
    healthCheck,
    processMeeting
};