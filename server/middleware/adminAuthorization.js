const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const db = require("../db");

dotenv.config();

module.exports = async (req, res, next) => {
    try {
        let jwtToken = req.header("Authorization");

        if (!jwtToken) {
            return res.status(403).json({ message: "Not Authorized" });
        }

        if (jwtToken.startsWith('Bearer ')) {
            jwtToken = jwtToken.slice(7, jwtToken.length).trimLeft();
        }

        const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);
        req.user = payload;

        // Check if user is actually admin
        const user = await db.query("SELECT role FROM users WHERE id = $1", [req.user.user_id]);

        if (user.rows.length === 0 || user.rows[0].role !== 'admin') {
            return res.status(403).json({ message: "Admin Access Required" });
        }

        next();
    } catch (err) {
        console.error(err.message);
        return res.status(403).json({ message: "Not Authorized" });
    }
};
