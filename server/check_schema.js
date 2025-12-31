const { Client } = require('pg');
require('dotenv').config({ path: '../.env' });

const client = new Client({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'event_platform',
});

async function checkSchema() {
    try {
        await client.connect();
        const res = await client.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'users'");
        console.log("Columns in users table:", res.rows.map(r => r.column_name));
        await client.end();
    } catch (err) {
        console.error(err);
    }
}

checkSchema();
