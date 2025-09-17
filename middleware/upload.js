const multer = require('multer');
const path = require('path');
const config = require('../config/app');

// Configure multer for file uploads
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: config.FILE_SIZE_LIMIT,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/plain' || path.extname(file.originalname).toLowerCase() === '.txt') {
            cb(null, true);
        } else {
            cb(new Error('Only .txt files are allowed'), false);
        }
    }
});

module.exports = upload;