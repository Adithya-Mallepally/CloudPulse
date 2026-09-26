const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "cloudpulse_default_secret_key";

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"] || req.headers["x-access-token"];
  if (!authHeader) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    return res.status(400).json({ error: "Invalid token.", details: ex.message });
  }
}

module.exports = { verifyToken };
