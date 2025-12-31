const { Client } = require('pg');
require('dotenv').config({ path: './.env' });

const client = new Client({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'event_platform',
});

async function promoteToAdmin() {
    try {
        await client.connect();
        const email = 'kotireddyambati301@gmail.com';

        // Check if user exists
        const res = await client.query("SELECT * FROM users WHERE email = $1", [email]);

        if (res.rows.length === 0) {
            console.log(`User ${email} not found! Please register this user first.`);
        } else {
            // Update role
            await client.query("UPDATE users SET role = 'admin' WHERE email = $1", [email]);
            console.log(`SUCCESS: User ${email} has been promoted to ADMIN.`);
        }

        await client.end();
    } catch (err) {
        console.error("Error:", err);
    }
}

promoteToAdmin();
