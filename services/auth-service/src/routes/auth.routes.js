const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { verifyToken } = require("../middleware/auth.middleware");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "cloudpulse_default_secret_key";

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Username, email, and password are required." });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists with that email or username." });
    }

    const user = new User({ username, email, password, role: role || "user" });
    await user.save();

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if ((!username && !email) || !password) {
      return res.status(400).json({ error: "Identifier and password required." });
    }

    const query = email ? { email } : { username };
    const user = await User.findOne(query);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/verify", verifyToken, (req, res) => {
  return res.json({ valid: true, user: req.user });
});

router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
