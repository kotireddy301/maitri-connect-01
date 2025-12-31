process.env.DB_USER = 'postgres';
process.env.DB_PASSWORD = 'admin123';
process.env.DB_HOST = 'localhost';
process.env.DB_NAME = 'event_platform';
process.env.DB_PORT = '5432';

const db = require('./db');

async function debug() {
    try {
        console.log("--- USERS ---");
        const users = await db.query("SELECT id, first_name, email, role FROM users");
        console.log(JSON.stringify(users.rows, null, 2));

        console.log("\n--- EVENTS ---");
        const events = await db.query("SELECT id, title, organizer_id, status FROM events");
        console.log(JSON.stringify(events.rows, null, 2));

    } catch (err) {
        console.error(err);
    }
}

debug();
