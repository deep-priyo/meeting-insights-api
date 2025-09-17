const multer = require('multer');

// Handle multer errors
const errorHandler = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'File size too large. Maximum size is 10MB.'
            });
        }
    }

    if (error.message === 'Only .txt files are allowed') {
        return res.status(400).json({
            error: 'Invalid file type. Only .txt files are supported.'
        });
    }

    next(error);
};

module.exports = errorHandler;