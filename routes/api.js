const express = require('express');
const router = express.Router();

const meetingController = require('../controllers/meetingController');
const upload = require('../middleware/upload');

// Health check endpoint
router.get('/health', meetingController.healthCheck);

// Main endpoint to process meeting notes
router.post('/process-meeting', upload.single('file'), meetingController.processMeeting);

module.exports = router;