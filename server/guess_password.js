const { Client } = require('pg');
require('dotenv').config();

const commonPasswords = ['postgres', 'password', '1234', '12345', 'admin', 'root'];
const userParams = process.env.DB_PASSWORD; // Try the one in .env too

async function tryConnect(pwd) {
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres', // Connect to default DB
        password: pwd,
        port: 5432,
    });
    try {
        await client.connect();
        console.log(`✅ MATCH FOUND! Password is: '${pwd}'`);
        await client.end();
        return true;
    } catch (err) {
        return false;
    }
}

async function run() {
    console.log("Checking common passwords...");

    // Check .env one specifically again
    if (await tryConnect(userParams)) {
        console.log("WAIT. The password in .env IS correct?");
        return;
    }

    for (const pwd of commonPasswords) {
        if (await tryConnect(pwd)) return;
    }
    console.log("❌ No common password worked.");
}

run();
