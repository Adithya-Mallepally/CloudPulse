const express = require("express");
const cors = require("cors");
const winston = require("winston");

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

const notifications = [
  {
    id: "1",
    service: "metrics-service",
    severity: "warning",
    message: "High memory utilization detected (>85%)",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "2",
    service: "auth-service",
    severity: "info",
    message: "Auth service health check passed",
    timestamp: new Date().toISOString(),
  }
];

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "notification-service",
    timestamp: new Date().toISOString(),
  });
});

app.get("/notifications", (req, res) => {
  res.json({
    count: notifications.length,
    notifications,
  });
});

app.post("/notifications/alert", (req, res) => {
  const { service, severity, message } = req.body;
  if (!service || !message) {
    return res.status(400).json({ error: "service and message are required" });
  }

  const alert = {
    id: String(Date.now()),
    service,
    severity: severity || "warning",
    message,
    timestamp: new Date().toISOString(),
  };

  notifications.unshift(alert);
  logger.warn(`New alert received: [${alert.severity.toUpperCase()}] ${service} - ${message}`);
  res.status(201).json({ message: "Alert created", alert });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  logger.info(`Notification service listening on port ${PORT}`);
});

module.exports = app;
