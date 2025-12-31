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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// Force restart: 123
