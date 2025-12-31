process.env.DB_USER = 'postgres';
process.env.DB_PASSWORD = 'admin123';
process.env.DB_HOST = 'localhost';
process.env.DB_NAME = 'event_platform';
process.env.DB_PORT = '5432';

const db = require('./db');

async function checkSchema() {
    try {
        console.log("--- COLUMNS IN EVENTS TABLE ---");
        const res = await db.query(`
            SELECT column_name
            FROM information_schema.columns 
            WHERE table_name = 'events';
        `);
        console.log(JSON.stringify(res.rows, null, 2));
    } catch (err) {
        console.error(err);
    }
}

checkSchema();
