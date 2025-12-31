const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { query } = require('./db');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test Route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Routes (Placeholders for now)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

// Debug Route for Database (Temporary)
app.get('/api/debug-db', async (req, res) => {
    try {
        const { query } = require('./db');
        const timeRes = await query('SELECT NOW()');
        const tablesRes = await query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");

        let usersCount = 'Table missing';
        try {
            const uCount = await query('SELECT COUNT(*) FROM users');
            usersCount = uCount.rows[0].count;
        } catch (e) { usersCount = e.message; }

        res.json({
            status: 'online',
            db_time: timeRes.rows[0].now,
            tables: tablesRes.rows.map(r => r.table_name),
            users_count: usersCount,
            env: {
                has_db_url: !!process.env.DATABASE_URL,
                db_host: process.env.DB_HOST,
                db_user: process.env.DB_USER
            }
        });
    } catch (err) {
        console.error("DB Debug Error:", err);
        res.status(500).json({
            status: 'error',
            message: err.message,
            stack: err.stack,
            env: {
                has_db_url: !!process.env.DATABASE_URL
            }
        });
    }
});

// Force Init DB Route
app.get('/api/force-init-db', async (req, res) => {
    try {
        const fs = require('fs');
        const schemaPath = path.join(__dirname, 'db', 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        await query(schemaSql);

        res.json({ message: "Schema applied successfully! Tables created." });
    } catch (err) {
        console.error("Force Init Error:", err);
        res.status(500).json({ message: err.message, stack: err.stack });
    }
});

// Promote User to Admin Route
app.get('/api/promote-admin', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ message: "Please provide ?email=your@email.com" });

        const result = await query("UPDATE users SET role = 'admin' WHERE email = $1 RETURNING *", [email]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: `User ${email} is now an ADMIN!`, user: result.rows[0] });
    } catch (err) {
        console.error("Promote Error:", err);
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// Force restart: 123
