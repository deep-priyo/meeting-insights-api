// Utility functions for the application

/**
 * Validate if text is not empty
 * @param {string} text - Text to validate
 * @returns {boolean} - True if text is valid
 */
const isValidText = (text) => {
    return text && typeof text === 'string' && text.trim().length > 0;
};

/**
 * Sanitize text input
 * @param {string} text - Text to sanitize
 * @returns {string} - Sanitized text
 */
const sanitizeText = (text) => {
    if (!text || typeof text !== 'string') return '';
    return text.trim();
};

/**
 * Check if text exceeds character limit
 * @param {string} text - Text to check
 * @param {number} limit - Character limit
 * @returns {boolean} - True if text exceeds limit
 */
const exceedsCharLimit = (text, limit) => {
    return text && text.length > limit;
};

module.exports = {
    isValidText,
    sanitizeText,
    exceedsCharLimit
};