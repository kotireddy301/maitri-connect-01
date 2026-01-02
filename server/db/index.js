const { Pool } = require('pg');
require('dotenv').config();

/**
 * HARDCODED FALLBACK FOR HOSTINGER
 * This is used because Hostinger's environment variables are failing.
 */

const HARDCODED_URL = 'postgresql://postgres.nhjzerqlykdtuxdhlcek:akr301244!A%23@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';

const DATABASE_URL = process.env.DATABASE_URL || HARDCODED_URL;

const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    }
});

pool.on('connect', () => {
    console.log('✅ Connected to Supabase via Pooler');
});

pool.on('error', (err) => {
    console.error('❌ Pool Error:', err.message);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};
