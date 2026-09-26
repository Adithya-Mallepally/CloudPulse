const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());

// Serve static frontend
app.use(express.static(path.join(__dirname, "public")));

// Fallback to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`[CloudPulse] Dashboard running on port ${PORT}`);
});

module.exports = app;
