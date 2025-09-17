require('dotenv').config();

const config = {
    PORT: process.env.PORT || 3000,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
    FILE_SIZE_LIMIT: 10 * 1024 * 1024, // 10MB
    TEXT_SIZE_LIMIT: 50000,
    JSON_LIMIT: '10mb',
    TEXT_LIMIT: '10mb'
};

module.exports = config;