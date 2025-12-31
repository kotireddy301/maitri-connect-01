const { Client } = require('pg');
require('dotenv').config();

async function diagnose() {
    console.log("--- START DIAGNOSIS ---");
    console.log(`Attempting to connect with:`);
    console.log(`User: ${process.env.DB_USER}`);
    console.log(`Port: ${process.env.DB_PORT}`);
    console.log(`Database: ${process.env.DB_NAME}`);

    // Test 1: Connect to specific database
    console.log("\n[Test 1] Connecting to target database 'event_platform'...");
    const client1 = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });

    try {
        await client1.connect();
        console.log("✅ SUCCESS: Connected to 'event_platform'");
        await client1.end();
    } catch (err) {
        console.log("❌ FAILED: " + err.message);
        if (err.message.includes('password')) console.log("   -> CAUSE: Wrong Password");
        if (err.message.includes('does not exist')) console.log("   -> CAUSE: Database name is wrong or not created");
    }

    // Test 2: Connect to default 'postgres' database (to verify password only)
    console.log("\n[Test 2] Connecting to default 'postgres' database...");
    const client2 = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: 'postgres',
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });

    try {
        await client2.connect();
        console.log("✅ SUCCESS: Password is CORRECT (Connected to 'postgres')");
        await client2.end();
    } catch (err) {
        console.log("❌ FAILED: " + err.message);
    }
    console.log("--- END DIAGNOSIS ---");
}

diagnose();
