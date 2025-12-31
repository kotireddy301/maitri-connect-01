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
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'events' AND column_name = 'organizer_id';
        `);

        console.table(res.rows);
        fs.writeFileSync(path.join(__dirname, 'datatype_status.txt'), JSON.stringify(res.rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
