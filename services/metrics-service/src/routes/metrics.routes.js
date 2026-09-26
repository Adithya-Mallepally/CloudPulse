const express = require("express");
const mongoose = require("mongoose");
const Metric = require("../models/metric.model");
const { collectSystemMetrics } = require("../collectors/system.collector");


const router = express.Router();

router.get("/live", (req, res) => {
  const current = collectSystemMetrics();
  res.json(current);
});

router.post("/", async (req, res) => {
  try {
    const { serviceName, cpuUsage, memoryUsage, uptime, activeRequests } = req.body;
    if (!serviceName) {
      return res.status(400).json({ error: "serviceName is required" });
    }

    if (mongoose.connection.readyState === 1) {
      const metric = new Metric({
        serviceName,
        cpuUsage: cpuUsage ?? 0,
        memoryUsage: memoryUsage ?? 0,
        uptime: uptime ?? 0,
        activeRequests: activeRequests ?? 0,
      });
      await metric.save();
      return res.status(201).json({ message: "Metric saved", metric });
    }

    return res.status(201).json({
      message: "Metric accepted",
      metric: { serviceName, cpuUsage: cpuUsage ?? 0, memoryUsage: memoryUsage ?? 0 },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/summary", async (req, res) => {
  try {
    const live = collectSystemMetrics();
    let history = [];
    if (mongoose.connection.readyState === 1) {
      history = await Metric.find().sort({ timestamp: -1 }).limit(20);
    }

    res.json({
      system: live,
      recordedPoints: history.length,
      history,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
