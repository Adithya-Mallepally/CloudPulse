const mongoose = require("mongoose");

const MetricSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: true,
  },
  cpuUsage: {
    type: Number,
    required: true,
  },
  memoryUsage: {
    type: Number,
    required: true,
  },
  uptime: {
    type: Number,
    required: true,
  },
  activeRequests: {
    type: Number,
    default: 0,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Metric", MetricSchema);
