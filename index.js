const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const { query } = require('./db');
const path = require('path');

console.log('--- SERVER STARTING ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DATABASE_URL present:', !!process.env.DATABASE_URL);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handlers for startup
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});

// Test Route
app.get('/api/health', async (req, res) => {
    try {
        const result = await query('SELECT NOW()');
        res.json({
            status: 'ok',
            message: 'Server is running',
            db: 'connected',
            time: result.rows[0].now,
            port: PORT,
            env: process.env.NODE_ENV
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Server is running but DB failed',
            error: err.message,
            env_check: process.env.DATABASE_URL ? 'URL Present' : 'URL Missing'
        });
    }
});

// Serve static assets in production
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'), (err) => {
        if (err) {
            res.status(404).send('Frontend files not found. Please run build.');
        }
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
// Force restart: 123
