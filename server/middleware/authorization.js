const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = async (req, res, next) => {
    try {
        let token = req.header('Authorization');

        if (!token) {
            return res.status(403).json({ message: 'Authorization denied' });
        }

        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length).trimLeft();
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();

    } catch (err) {
        console.error(err.message);
        return res.status(401).json({ message: 'Token is not valid' });
    }
};
