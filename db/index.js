const { Pool } = require('pg');
require('dotenv').config();

/**
 * PRODUCTION DATABASE CONFIGURATION
 * Optimized for Supabase Pooler
 */

if (!process.env.DATABASE_URL) {
    console.warn('⚠️ WARNING: DATABASE_URL is not set in environment variables.');
}

const pool = new Pool(
    process.env.DATABASE_URL
        ? {
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false,
            },
        }
        : {
            user: process.env.DB_USER || 'postgres',
            host: process.env.DB_HOST || 'localhost',
            database: process.env.DB_NAME || 'event_platform',
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT || 5432,
        }
);

// Debug connection events
pool.on('connect', () => {
    console.log('✅ Database Pool: Client connected');
});

pool.on('error', (err) => {
    console.error('❌ Database Pool Error:', err.message);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool // Export pool for specialized tasks if needed
};
