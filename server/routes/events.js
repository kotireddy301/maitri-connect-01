const router = require('express').Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const authorization = require('../middleware/authorization');
const adminAuthorization = require('../middleware/adminAuthorization');

// Multer Config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// PUBLIC: Get All Approved Events
router.get('/', async (req, res) => {
    try {
        const allEvents = await db.query("SELECT * FROM events WHERE status = 'approved' ORDER BY date ASC");
        res.json(allEvents.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// PROTECTED: Get My Listings
router.get('/user', authorization, async (req, res) => {
    try {
        console.log("Fetching events for user_id:", req.user.user_id);
        const userEvents = await db.query("SELECT * FROM events WHERE organizer_id = $1 ORDER BY created_at DESC", [req.user.user_id]);
        res.json(userEvents.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error: ' + err.message });
    }
});

// ADMIN: Get All Events (Pending, Approved, Rejected)
router.get('/admin/all', adminAuthorization, async (req, res) => {
    try {
        const allEvents = await db.query("SELECT events.*, users.first_name, users.last_name FROM events LEFT JOIN users ON events.organizer_id = users.id ORDER BY created_at DESC");
        res.json(allEvents.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// PUBLIC: Get Single Event Details
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const event = await db.query(
            `SELECT events.*, 
            users.first_name, users.last_name, users.email, users.mobile, users.profile_pic 
            FROM events 
            LEFT JOIN users ON events.organizer_id = users.id 
            WHERE events.id = $1`,
            [id]
        );

        if (event.rows.length === 0) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json(event.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// PROTECTED: Get My Listings


// PROTECTED: Submit Event
router.post('/', authorization, upload.single('flyer'), async (req, res) => {
    try {
        console.log("received event submission:", req.body);
        console.log("received file:", req.file);

        const { title, description, date, time, location, category, external_reg_url } = req.body;
        const image_url = req.file ? `/uploads/${req.file.filename}` : null;

        // Check user role for auto-approval
        const userCheck = await db.query("SELECT role FROM users WHERE id = $1", [req.user.user_id]);
        const isAdmin = userCheck.rows.length > 0 && userCheck.rows[0].role === 'admin';
        const status = isAdmin ? 'approved' : 'pending';

        const newEvent = await db.query(
            'INSERT INTO events (title, description, date, time, location, category, image_url, external_reg_url, organizer_id, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
            [title, description, date, time, location, category, image_url, external_reg_url, req.user.user_id, status]
        );

        res.json(newEvent.rows[0]);

    } catch (err) {
        console.error("Event Submission Error:", err);
        res.status(500).send('Server Error: ' + err.message);
    }
});

// PROTECTED: Update Event (Resets status to pending)
router.put('/:id', authorization, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, date, time, location, category, external_reg_url } = req.body;

        // Ensure user owns this event
        const checkOwner = await db.query("SELECT * FROM events WHERE id = $1 AND organizer_id = $2", [id, req.user.user_id]);
        if (checkOwner.rows.length === 0) {
            return res.status(403).json({ message: "Not authorized to edit this event" });
        }

        const updateEvent = await db.query(
            'UPDATE events SET title = $1, description = $2, date = $3, time = $4, location = $5, category = $6, external_reg_url = $7, status = $8 WHERE id = $9 RETURNING *',
            [title, description, date, time, location, category, external_reg_url, 'pending', id]
        );

        res.json(updateEvent.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// PROTECTED: Delete Event
router.delete('/:id', authorization, async (req, res) => {
    try {
        const { id } = req.params;

        // Ensure owner or admin (simplified to owner for now)
        const deleteEvent = await db.query("DELETE FROM events WHERE id = $1 AND organizer_id = $2 RETURNING *", [id, req.user.user_id]);

        if (deleteEvent.rows.length === 0) {
            return res.status(403).json({ message: "Not authorized or event not found" });
        }

        res.json({ message: "Event deleted" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



// ADMIN: Update Event Status
router.put('/:id/status', adminAuthorization, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'approved' or 'rejected'

        const updateEvent = await db.query(
            "UPDATE events SET status = $1 WHERE id = $2 RETURNING *",
            [status, id]
        );

        if (updateEvent.rows.length === 0) {
            return res.status(404).json({ message: "Event not found" });
        }

        const event = updateEvent.rows[0];

        // If approved, send email to organizer
        if (status === 'approved') {
            try {
                // Fetch organizer email
                const organizer = await db.query("SELECT email, first_name FROM users WHERE id = $1", [event.organizer_id]);

                if (organizer.rows.length > 0) {
                    const { email, first_name } = organizer.rows[0];

                    // Setup Nodemailer (reuses connection from auth.js implicitly if we extracted utility, but here we redefine/import)
                    // For simplicity, defining transporter locally or importing.
                    // Ideally, we move transporter to a utility file. For now, inline:
                    const nodemailer = require('nodemailer');

                    // Create Transporter (Using Ethereal for testing, replace with real SMTP in prod)
                    const transporter = nodemailer.createTransport({
                        host: 'smtp.ethereal.email',
                        port: 587,
                        auth: {
                            user: 'maximillia.stokes@ethereal.email', // Replace with valid Ethereal credentials if these expire
                            pass: 'yBKVqgJ8hW5qJ2YyJ4'
                        }
                    });

                    const mailOptions = {
                        from: '"MaitriConnect Admin" <admin@maitriconnect.com>',
                        to: email,
                        subject: 'Event Approved: ' + event.title,
                        html: `
                            <div style="font-family: Arial, sans-serif; padding: 20px;">
                                <h2 style="color: #D3043C;">Event Approved!</h2>
                                <p>Hi ${first_name},</p>
                                <p>Great news! Your event <strong>"${event.title}"</strong> has been approved by our admin team.</p>
                                <p>It is now live on our platform for everyone to see.</p>
                                <br/>
                                <a href="http://localhost:5173/events" style="background-color: #D3043C; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Events</a>
                                <p>Thank you for contributing to our community!</p>
                            </div>
                        `
                    };

                    const info = await transporter.sendMail(mailOptions);
                    console.log("Approval Email sent: %s", info.messageId);
                    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                }
            } catch (emailErr) {
                console.error("Failed to send approval email:", emailErr);
                // Don't fail the request just because email failed
            }
        }

        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// ADMIN: Delete Event (Admin Override)
router.delete('/admin/:id', adminAuthorization, async (req, res) => {
    try {
        const { id } = req.params;
        const deleteEvent = await db.query("DELETE FROM events WHERE id = $1 RETURNING *", [id]);

        if (deleteEvent.rows.length === 0) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json({ message: "Event deleted" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
