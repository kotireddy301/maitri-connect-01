/**
 * FINAL CONSOLIDATED ENTRY (server.js)
 * VERSION: 2.4 (DIAGNOSTIC_ULTIMATE)
 */

const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

// 1. LOGGER
app.use((req, res, next) => {
    console.log(`[V2.4] ${req.method} ${req.url}`);
    next();
});

let routeError = null;

// 2. SUPER HEALTH CHECK
app.all('/api/health*', async (req, res) => {
    try {
        const db = require('./db');
        let dbStatus = 'Checking...';
        try {
            await db.query('SELECT NOW()');
            dbStatus = 'Connected';
        } catch (e) {
            dbStatus = `DB_Error: ${e.message}`;
        }

        res.json({
            status: 'ok',
            version: '2.4-FIXED',
            db: dbStatus,
            mountError: routeError,
            structure: {
                hasPublic: fs.existsSync(path.join(__dirname, 'public')),
                hasRoutes: fs.existsSync(path.join(__dirname, 'routes')),
                hasAuth: fs.existsSync(path.join(__dirname, 'routes/auth.js')),
                hasEvents: fs.existsSync(path.join(__dirname, 'routes/events.js')),
                hasDb: fs.existsSync(path.join(__dirname, 'db/index.js')),
                hasUploads: fs.existsSync(path.join(__dirname, 'uploads'))
            },
            env: {
                hasDbUrl: !!process.env.DATABASE_URL,
                nodeEnv: process.env.NODE_ENV,
                port: PORT
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. API ROUTES
try {
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/events', require('./routes/events'));
    console.log('✅ API Routes connected');
} catch (err) {
    routeError = err.message;
    console.error('❌ Route loading failure:', err.message);
}

// 4. API 404 handler
app.all('/api/*', (req, res) => {
    res.status(404).json({
        error: "VERSION_2.4_API_NOT_FOUND",
        path: req.url,
        mountError: routeError
    });
});

// 5. STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 6. REACT FALLBACK
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'), (err) => {
        if (err) res.status(404).send("Frontend missing - check public/ folder");
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Version 2.4 Live on port ${PORT}`);
});

process.on('uncaughtException', (err) => { console.error('CRASH:', err); });
process.on('unhandledRejection', (err) => { console.error('REJECTION:', err); });
