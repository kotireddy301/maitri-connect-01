const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function testConnection() {
    try {
        console.log("Testing connection...");
        const res = await pool.query('SELECT NOW()');
        console.log("Connection successful:", res.rows[0]);

        console.log("Checking for 'users' table...");
        const tableCheck = await pool.query("SELECT to_regclass('public.users')");

        if (tableCheck.rows[0].to_regclass) {
            console.log("'users' table EXISTS.");
        } else {
            console.log("'users' table DOES NOT EXIST.");
        }
    } catch (err) {
        console.error("Database connection error:", err.message);
    } finally {
        await pool.end();
    }
}

testConnection();
