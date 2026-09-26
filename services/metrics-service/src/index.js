const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const winston = require("winston");
const metricsRoutes = require("./routes/metrics.routes");

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

// Routes
app.use("/metrics", metricsRoutes);
app.use("/api/metrics", metricsRoutes);

// Health check
app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.json({
    status: "ok",
    service: "metrics-service",
    database: dbState,
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/cloudpulse_metrics";

async function startServer() {
  try {
    if (process.env.NODE_ENV !== "test") {
      await mongoose.connect(MONGO_URI);
      logger.info(`Connected to MongoDB at ${MONGO_URI}`);
      app.listen(PORT, () => {
        logger.info(`Metrics service listening on port ${PORT}`);
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
