/**
 * FINAL CONSOLIDATED ENTRY (index.js)
 * VERSION: 2.6 (FINAL_FIX)
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
    console.log(`[V2.5] ${req.method} ${req.url}`);
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
            version: '2.6-FIXED',
            db: dbStatus,
            mountError: routeError,
            structure: {
                hasPublic: fs.existsSync(path.join(__dirname, 'public')),
                hasRoutes: fs.existsSync(path.join(__dirname, 'routes')),
                hasAuth: fs.existsSync(path.join(__dirname, 'routes/auth.js')),
            },
            env: {
                hasDbUrl: !!process.env.DATABASE_URL,
                nodeEnv: process.env.NODE_ENV,
                port: PORT,
                availableKeys: Object.keys(process.env).filter(k => !k.includes('PASS') && !k.includes('SECRET') && !k.includes('URL'))
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
} catch (err) {
    routeError = err.message;
}

app.all('/api/*', (req, res) => {
    res.status(404).json({ error: "VERSION_2.5_API_NOT_FOUND", mountError: routeError });
});

app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Version 2.5 Live on port ${PORT}`);
});
