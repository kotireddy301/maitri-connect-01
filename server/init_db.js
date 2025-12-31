const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function init() {
    console.log("🚀 Starting Automatic Database Initialization...");

    const commonConfig = {
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD, // 'admin123'
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
    };

    // Step 1: Connect to default 'postgres' DB to create our target DB
    const client1 = new Client({
        ...commonConfig,
        database: 'postgres',
    });

    try {
        await client1.connect();

        // Check if database exists
        const res = await client1.query("SELECT 1 FROM pg_database WHERE datname = 'event_platform'");
        if (res.rows.length === 0) {
            console.log("📦 Database 'event_platform' not found. Creating it...");
            await client1.query('CREATE DATABASE event_platform');
            console.log("✅ Database created!");
        } else {
            console.log("ℹ️ Database 'event_platform' already exists.");
        }
        await client1.end();

    } catch (err) {
        console.error("❌ Error in Step 1 (DB Creation):", err.message);
        return;
    }

    // Step 2: Connect to the new 'event_platform' and apply Schema
    console.log("📜 Applying Schema...");
    const client2 = new Client({
        ...commonConfig,
        database: 'event_platform',
    });

    try {
        await client2.connect();

        const schemaPath = path.join(__dirname, 'db', 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        await client2.query(schemaSql);
        console.log("✅ Schema applied (Tables created).");

        // Step 3: Seed Data (Seed only if events table is empty)
        const eventCheck = await client2.query("SELECT COUNT(*) FROM events");
        if (eventCheck.rows[0].count === '0') {
            console.log("🌱 Seeding Mock Data...");

            // Create Organizer
            let userId;
            const userCheck = await client2.query("SELECT id FROM users LIMIT 1");
            if (userCheck.rows.length === 0) {
                const newUser = await client2.query(`
                    INSERT INTO users (first_name, last_name, email, password_hash, role)
                    VALUES ('Demo', 'Organizer', 'demo@example.com', 'hash123', 'admin')
                    RETURNING id
                `);
                userId = newUser.rows[0].id;
            } else {
                userId = userCheck.rows[0].id;
            }

            // Insert Events
            const events = [
                {
                    title: "Grand Food Festival",
                    description: "Join us for a weekend of culinary delights featuring the best chefs in Houston. Live music, food trucks, and family fun!",
                    date: '2025-04-15',
                    time: '10:00:00',
                    location: 'Discovery Green',
                    category: 'Food & Drink',
                    image_url: null,
                    status: 'approved'
                },
                {
                    title: "Tech Startup Mixer",
                    description: "Network with local entrepreneurs and investors. A great opportunity to pitch your ideas and find co-founders.",
                    date: '2025-04-20',
                    time: '18:00:00',
                    location: 'The Ion',
                    category: 'Business',
                    image_url: null,
                    status: 'approved'
                },
                {
                    title: "Yoga in the Park",
                    description: "Free morning yoga session for all skill levels. Bring your own mat and water bottle.",
                    date: '2025-04-22',
                    time: '08:00:00',
                    location: 'Hermann Park',
                    category: 'Health',
                    image_url: null,
                    status: 'approved'
                }
            ];

            for (const e of events) {
                await client2.query(`
                    INSERT INTO events (title, description, date, time, location, category, image_url, status, organizer_id)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                `, [e.title, e.description, e.date, e.time, e.location, e.category, e.image_url, e.status, userId]);
            }
            console.log("✅ Mock data inserted!");
        } else {
            console.log("ℹ️ Data already exists. Skipping seed.");
        }

        await client2.end();
        console.log("🎉 INITIALIZATION COMPLETE! Everything is ready.");

    } catch (err) {
        console.error("❌ Error in Step 2 (Schema/Seed):", err.message);
    }
}

init();
