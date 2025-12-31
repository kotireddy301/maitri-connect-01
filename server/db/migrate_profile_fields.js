const { Client } = require('pg');
require('dotenv').config({ path: './.env' }); // Adjust path if running from server/db

const client = new Client({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'event_platform',
});

async function migrate() {
    try {
        await client.connect();

        console.log("Adding new columns to users table...");

        const queries = [
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS mobile VARCHAR(20)",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS country VARCHAR(100)",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS state VARCHAR(100)",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(100)",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS pincode VARCHAR(20)",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS languages TEXT[]" // Array of strings
        ];

        for (const query of queries) {
            await client.query(query);
            console.log(`Executed: ${query}`);
        }

        console.log("✅ Migration complete!");
        await client.end();
    } catch (err) {
        console.error("❌ Migration failed:", err);
    }
}

migrate();
