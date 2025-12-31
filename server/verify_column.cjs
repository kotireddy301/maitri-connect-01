process.env.DB_USER = 'postgres';
process.env.DB_PASSWORD = 'admin123';
process.env.DB_HOST = 'localhost';
process.env.DB_NAME = 'event_platform';
process.env.DB_PORT = '5432';

const db = require('./db');
const fs = require('fs');
const path = require('path');

async function check() {
    try {
        const res = await db.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'events' AND column_name = 'created_at';
        `);

        const status = res.rows.length > 0 ? "YES_CREATED_AT_EXISTS" : "NO_CREATED_AT_MISSING";
        fs.writeFileSync(path.join(__dirname, 'column_status.txt'), status);
        console.log(status);
        process.exit(0);
    } catch (err) {
        fs.writeFileSync(path.join(__dirname, 'column_status.txt'), "ERROR: " + err.message);
        console.error(err);
        process.exit(1);
    }
}

check();
