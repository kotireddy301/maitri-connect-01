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

// Request Logger (Helpful for 404 debugging)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// 4. API Routes (PRIORITY)
try {
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/events', require('./routes/events'));

    // API Health Check
    app.get('/api/health', async (req, res) => {
        try {
            const result = await (require('./db').query)('SELECT NOW()');
            res.json({ status: 'ok', db: 'connected', time: result.rows[0].now });
        } catch (err) {
            res.status(500).json({ status: 'error', error: err.message });
        }
    });

    console.log('✅ API Routes connected');
} catch (err) {
    console.error('❌ Route loading error:', err.message);
}

// 5. Static Files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 6. Specific 404 for API
app.all('/api/*', (req, res) => {
    res.status(404).json({ error: `API route not found: ${req.method} ${req.url}` });
});

// 7. React Router Fallback
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
