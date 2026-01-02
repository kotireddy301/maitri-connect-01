/**
 * DEBUGGING INDEX.JS
 * Solving the 404 matching issue
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

// 1. IMPROVED LOGGER (Logs everything)
app.use((req, res, next) => {
    console.log(`[DEBUG] ${req.method} ${req.url} (Path: ${req.path})`);
    next();
});

// 2. SUPER ROBUST HEALTH CHECK
// Using .all and a broad path to ensure it triggers
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
            message: 'Health Check Hit',
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

// 3. API ROUTES
try {
    app.use('/api/auth', require('./routes/auth'));
    app.use('/api/events', require('./routes/events'));
    console.log('✅ Routes Registered');
} catch (err) {
    console.error('❌ Route Init Fail:', err.message);
}

// 4. API 404 Handler (This is catching too much?)
app.use('/api/*', (req, res) => {
    res.status(404).json({
        error: "API 404",
        requested: `${req.method} ${req.url}`,
        tip: "Check if the route exists in routes/ folder"
    });
});

// 5. Frontend Fallback
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Debug Server on port ${PORT}`);
});
