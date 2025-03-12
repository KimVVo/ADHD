const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    // Correctly access headers
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Extract token correctly

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" }); // Return 403 for invalid token
        }
        req.user = user; // Attach user to request
        next();
    });
}

module.exports = { authenticateToken };