const { Client } = require('pg');
require('dotenv').config({ path: './.env' }); // Ensure .env is loaded

const client = new Client({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'event_platform',
});

async function checkUser() {
    try {
        await client.connect();
        const res = await client.query("SELECT id, first_name, email, password_hash FROM users WHERE email = 'kotireddyambati244@gmail.com'");
        console.log("User search result:", res.rows);

        const allUsers = await client.query("SELECT id, email, password_hash FROM users");
        console.log("All users:", allUsers.rows);

        await client.end();
    } catch (err) {
        console.error("Error query:", err);
    }
}

checkUser();
