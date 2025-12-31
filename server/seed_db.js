const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

async function seedData() {
    try {
        console.log("Seeding data...");

        // 1. Ensure a user exists to be the organizer
        let userRes = await pool.query("SELECT id FROM users LIMIT 1");
        let userId;

        if (userRes.rows.length === 0) {
            console.log("No users found. Creating a dummy organizer...");
            const newUser = await pool.query(`
                INSERT INTO users (first_name, last_name, email, password_hash, role)
                VALUES ('Demo', 'Organizer', 'demo@example.com', 'hash123', 'admin')
                RETURNING id
            `);
            userId = newUser.rows[0].id;
        } else {
            userId = userRes.rows[0].id;
        }

        // 2. Insert Mock Events
        const events = [
            {
                title: "Grand Food Festival",
                description: "Join us for a weekend of culinary delights featuring the best chefs in Houston. Live music, food trucks, and family fun!",
                date: '2025-04-15',
                time: '10:00:00',
                location: 'Discovery Green',
                category: 'Food & Drink',
                image_url: null, // UI will use default placeholder
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
            await pool.query(`
                INSERT INTO events (title, description, date, time, location, category, image_url, status, organizer_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            `, [e.title, e.description, e.date, e.time, e.location, e.category, e.image_url, e.status, userId]);
        }

        console.log(`Successfully seeded ${events.length} events!`);

    } catch (err) {
        console.error("Seeding error:", err.message);
    } finally {
        await pool.end();
    }
}

seedData();
