/**
 * FINAL STABLE INDEX.JS
 * Optimized for Hostinger Node.js Web App
 */

// 1. Load environment variables at the very top
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const path = require('path');

// 2. Setup Port (Hostinger usually injects PORT, but we provide a fallback)
const PORT = process.env.PORT || 5000;

const app = express();

console.log('--- SERVER RESTARTING ---');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', PORT);

// 3. Middlewares
app.use(cors());
app.use(express.json());

// Serve static build files
app.use(express.static(path.join(__dirname, 'public')));

// Serve uploads folder (Important for images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 4. Safe Database Loading
let query;
try {
    const db = require('./db');
    query = db.query;
    console.log('✅ Database module loaded');
} catch (err) {
    console.error('⚠️ Database failed to load:', err.message);
}

// 5. Health Check
app.get('/api/health', async (req, res) => {
    try {
        if (!query) throw new Error('DB Module not initialized');
        const result = await query('SELECT NOW()');
        res.json({
            status: 'ok',
            db: 'connected',
            time: result.rows[0].now
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Server is up but DB failed',
            error: err.message
        });
    }
});

// 6. Routes (Try-Catch to prevent startup crash)
try {
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/events', require('./routes/events'));
    console.log('✅ API Routes connected');
} catch (err) {
    console.error('❌ Route loading error:', err.message);
}

// 7. React Router Fallback (MUST be last)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'), (err) => {
        if (err) {
            res.status(404).send('Frontend not found. Please run "npm run build"');
        }
    });
});

// 8. Start Listening
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server listening on 0.0.0.0:${PORT}`);
});

// 9. Process Safety
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION:', err);
});
