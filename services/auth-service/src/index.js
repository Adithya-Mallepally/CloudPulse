const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const winston = require("winston");
const authRoutes = require("./routes/auth.routes");

const app = express();

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()],
});

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  logger.info({ method: req.method, path: req.url, ip: req.ip });
  next();
});

// Routes
app.use("/auth", authRoutes);
app.use("/api/auth", authRoutes);

// Health check
app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({
    status: "ok",
    service: "auth-service",
    database: dbState,
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/cloudpulse_auth";

async function startServer() {
  try {
    if (process.env.NODE_ENV !== "test") {
      await mongoose.connect(MONGO_URI);
      logger.info(`Connected to MongoDB at ${MONGO_URI}`);
      app.listen(PORT, () => {
        logger.info(`Auth service listening on port ${PORT}`);
      });
    }
  } catch (err) {
    logger.error("Failed to connect to database:", err);
  }
}


if (require.main === module) {
  startServer();
}

module.exports = app;
