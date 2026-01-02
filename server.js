/**
 * FRESH ENTRY POINT (server.js)
 * Bypassing cached index.js
 * Version: 2.1 (FINAL_DIAGNOSTIC)
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

// 1. LOGGER (Check paths)
app.use((req, res, next) => {
    console.log(`[REQ] ${req.method} ${req.url}`);
    next();
});

// 2. FORCED HEALTH CHECK (Wildcard)
app.all('/api/health*', async (req, res) => {
    try {
        const db = require('./db');
        let dbStatus = 'Checking...';
        try {
            await db.query('SELECT NOW()');
            dbStatus = 'Connected';
        } catch (e) {
            dbStatus = `Connection Error: ${e.message}`;
        }

        res.json({
            status: 'ok',
            version: '2.1-FIXED',
            message: 'SUPER_HEALTH_CHECK_ACTIVE',
            time: new Date().toISOString(),
            db: dbStatus,
            structure: {
                hasPublic: fs.existsSync(path.join(__dirname, 'public')),
                hasRoutes: fs.existsSync(path.join(__dirname, 'routes')),
                hasAuth: fs.existsSync(path.join(__dirname, 'routes/auth.js'))
            },
            env: {
                hasDbUrl: !!process.env.DATABASE_URL,
                nodeEnv: process.env.NODE_ENV
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. LOAD API ROUTES
try {
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/events', require('./routes/events'));
    console.log('✅ API Routes connected to server.js');
} catch (err) {
    console.error('❌ Route loading failure:', err.message);
}

// 4. API 404 handler (Customized for version identification)
app.all('/api/*', (req, res) => {
    res.status(404).json({
        error: "VERSION_2.1_API_NOT_FOUND",
        path: req.url,
        method: req.method
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
    console.log(`🚀 Version 2.1 Live on port ${PORT}`);
});

process.on('uncaughtException', (err) => { console.error('CRASH:', err); });
process.on('unhandledRejection', (err) => { console.error('REJECTION:', err); });
