require('dotenv').config({ path: 'server/.env' });
const db = require('./index');

async function migrate() {
    try {
        console.log("🚀 Starting Migration...");
        await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_password_token VARCHAR(255)`);
        await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_password_expires BIGINT`);
        console.log("✅ Migration successful: Added reset token columns to users table.");
    } catch (err) {
        console.error("❌ Migration failed:", err.message);
    }
}

migrate();
