/**
 * DATABASE INITIALIZATION TOOL
 * ⚠️ WARNING: Run this locally once before deploying to production.
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function init() {
    console.log("🚀 Starting Database Initialization...");

    const connectionString = process.env.DATABASE_URL;
    const isProduction = !!connectionString;

    // Use connection string directly if available, otherwise use discrete components
    const connectionConfig = isProduction
        ? {
            connectionString: connectionString.trim(),
            ssl: { rejectUnauthorized: false },
        }
        : {
            user: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 5432,
            database: 'postgres', // Connect to default postgres first
        };

    const client = new Client(connectionConfig);

    try {
        await client.connect();

        // Local only: Ensure database exists
        if (!isProduction) {
            console.log("📦 Checking for database 'event_platform'...");
            const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'event_platform'");
            if (res.rows.length === 0) {
                await client.query('CREATE DATABASE event_platform');
                console.log("✅ Database 'event_platform' created.");
            }
            // Switch to the correct database for local
            await client.end();
            const localClient = new Client({ ...connectionConfig, database: 'event_platform' });
            await localClient.connect();
            await applySchema(localClient);
            await localClient.end();
        } else {
            console.log("☁️ Connected to Cloud Database.");
            await applySchema(client);
            await client.end();
        }

        console.log("🎉 INITIALIZATION COMPLETE!");
    } catch (err) {
        console.error("❌ Initialization Failed:", err.message);
        process.exit(1);
    }
}

async function applySchema(client) {
    console.log("📜 Applying Schema...");
    const schemaPath = path.join(__dirname, 'db', 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schemaSql);
    console.log("✅ Schema applied.");
}

init();
