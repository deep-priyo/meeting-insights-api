const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const config = require('./config/app');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: config.JSON_LIMIT }));
app.use(express.text({ limit: config.TEXT_LIMIT }));

// Routes
app.use('/api', apiRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
});