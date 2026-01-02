const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const multer = require('multer');
const path = require('path');

// Multer Config for Profile Pics
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, 'profile-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Register
router.post('/register', async (req, res) => {
    try {
        let { first_name, last_name, email, password, name } = req.body;

        // Handle single 'name' field from frontend
        if (!first_name && name) {
            const nameParts = name.trim().split(' ');
            first_name = nameParts[0];
            last_name = nameParts.slice(1).join(' ') || ''; // Handle case with no last name
        }

        // Check if user exists

        // Check if user exists
        const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(401).json({ message: 'User already exists' });
        }

        // Hash password
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);

        // Insert user
        const newUser = await db.query(
            'INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *',
            [first_name, last_name, email, bcryptPassword]
        );

        // Generate Token
        const token = jwt.sign({ user_id: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: newUser.rows[0] });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            return res.status(401).json({ message: 'Password or Email is incorrect' });
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);

        if (!validPassword) {
            return res.status(401).json({ message: 'Password or Email is incorrect' });
        }

        const token = jwt.sign({ user_id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { id: user.rows[0].id, name: user.rows[0].first_name, email: user.rows[0].email, role: user.rows[0].role } });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error: ' + err.message });
    }
});

const authorization = require('../middleware/authorization');

// Get User Profile (Protected)
router.get('/profile', authorization, async (req, res) => {
    try {
        const user = await db.query(
            'SELECT id, first_name, last_name, email, role, profile_pic, mobile, bio, address, country, state, city, pincode, languages FROM users WHERE id = $1',
            [req.user.user_id]
        );
        res.json(user.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error: ' + err.message });
    }
});

// Update Profile (Protected)
// Update Profile (Protected)
router.put('/profile', authorization, upload.single('profile_pic'), async (req, res) => {
    try {
        console.log("Received profile update request");
        console.log("Body:", req.body);
        console.log("File:", req.file);

        const { first_name, last_name, email, mobile, bio, address, country, state, city, pincode, languages } = req.body;

        // Debugging: Check if user exists
        const userCheck = await db.query("SELECT * FROM users WHERE id = $1", [req.user.user_id]);
        if (userCheck.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Prepare dynamic update query
        let query = 'UPDATE users SET first_name = $1, last_name = $2, email = $3';
        let values = [first_name, last_name, email];
        let paramIndex = 4;

        // Helper to add fields if they exist in request (or allow null checks)
        // Since we want to allow updating to empty strings, we just add them.

        query += `, mobile = $${paramIndex++}`;
        values.push(mobile);

        query += `, bio = $${paramIndex++}`;
        values.push(bio);

        query += `, address = $${paramIndex++}`;
        values.push(address);

        query += `, country = $${paramIndex++}`;
        values.push(country);

        query += `, state = $${paramIndex++}`;
        values.push(state);

        query += `, city = $${paramIndex++}`;
        values.push(city);

        query += `, pincode = $${paramIndex++}`;
        values.push(pincode);

        // Handle languages array (store as string or JSON if preferred, here assuming text array in DB)
        // If coming as string, split it. If array, just use it.
        let langs = languages;
        if (typeof languages === 'string') {
            langs = languages.split(',').map(l => l.trim()).filter(l => l);
        }
        query += `, languages = $${paramIndex++}`;
        values.push(langs);

        let returnClause = ' RETURNING id, first_name, last_name, email, role, profile_pic, mobile, bio, address, country, state, city, pincode, languages';

        if (req.file) {
            const profile_pic = `/uploads/${req.file.filename}`;
            query += `, profile_pic = $${paramIndex++}`;
            values.push(profile_pic);
        }

        query += ` WHERE id = $${paramIndex}`;
        values.push(req.user.user_id);
        query += returnClause;

        console.log("Executing query:", query);
        console.log("Values:", values);

        const updateUser = await db.query(query, values);

        console.log("Update successful:", updateUser.rows[0]);
        res.json(updateUser.rows[0]);
    } catch (err) {
        console.error("Profile update error:", err.message);
        res.status(500).json({ message: err.message });
    }
});

// Change Password (Protected)
router.put('/password', authorization, async (req, res) => {
    try {
        console.log("Received password change request for user:", req.user.user_id);
        const { current_password, new_password } = req.body;

        // Get user hash
        const user = await db.query('SELECT password_hash FROM users WHERE id = $1', [req.user.user_id]);

        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const validPassword = await bcrypt.compare(current_password, user.rows[0].password_hash);

        if (!validPassword) {
            console.log("Password change failed: Invalid current password");
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(new_password, salt);

        await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [bcryptPassword, req.user.user_id]);

        console.log("Password updated successfully for user:", req.user.user_id);
        res.json({ message: 'Password updated successfully' });

    } catch (err) {
        console.error("Password update error:", err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});


const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

// Configure Nodemailer (Using Ethereal for testing, replace with real credentials in .env for production)
const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.pass'
    }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const token = uuidv4();
        // Token expires in 1 hour (3600000 ms)
        const expiresAt = Date.now() + 3600000;

        await db.query(
            'UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE id = $3',
            [token, expiresAt, user.rows[0].id]
        );

        const resetLink = `http://localhost:5173/reset-password/${token}`;

        console.log(`\n========================================`);
        console.log(`🔗 RESET LINK: ${resetLink}`);
        console.log(`========================================\n`);

        // Attempt to send email (Mock)
        // In production, uncomment the sendMail block with valid credentials
        /*
        await transporter.sendMail({
            to: email,
            subject: 'Password Reset',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
        });
        */

        res.json({ message: 'Password reset link sent to email (Check server console for link)' });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error: ' + err.message });
    }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
    try {
        const { token, new_password } = req.body;

        const user = await db.query(
            'SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expires > $2',
            [token, Date.now()]
        );

        if (user.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const salt = await bcrypt.genSalt(10);
        const bcryptPassword = await bcrypt.hash(new_password, salt);

        await db.query(
            'UPDATE users SET password_hash = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2',
            [bcryptPassword, user.rows[0].id]
        );

        res.json({ message: 'Password updated successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error: ' + err.message });
    }
});

module.exports = router;
