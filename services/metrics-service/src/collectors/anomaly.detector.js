/**
 * anomaly.detector.js
 * ───────────────────
 * Real-time time-series statistical anomaly detection for microservices metrics.
 * Uses moving z-score analysis to identify CPU throttling and memory exhaustion leaks.
 */

class TelemetryAnomalyDetector {
  constructor(windowSize = 20, zThreshold = 2.2) {
    this.windowSize = windowSize;
    this.zThreshold = zThreshold;
    this.history = [];
  }

  recordObservation(sample) {
    this.history.push({
      cpu: sample.cpuUsage || 0,
      memory: sample.memoryUsage || 0,
      timestamp: Date.now(),
    });

    if (this.history.length > this.windowSize) {
      this.history.shift();
    }
  }

  detectAnomalies(currentSample) {
    if (this.history.length < 3) {
      this.recordObservation(currentSample);
      return { hasAnomaly: false, anomalies: [] };
    }

    const cpuValues = this.history.map((h) => h.cpu);
    const memValues = this.history.map((h) => h.memory);

    const cpuMean = cpuValues.reduce((a, b) => a + b, 0) / cpuValues.length;
    const cpuStd = Math.sqrt(
      cpuValues.map((x) => Math.pow(x - cpuMean, 2)).reduce((a, b) => a + b, 0) / cpuValues.length
    ) || 1;

    const memMean = memValues.reduce((a, b) => a + b, 0) / memValues.length;
    const memStd = Math.sqrt(
      memValues.map((x) => Math.pow(x - memMean, 2)).reduce((a, b) => a + b, 0) / memValues.length
    ) || 1;

    const cpuZ = (currentSample.cpuUsage - cpuMean) / cpuStd;
    const memZ = (currentSample.memoryUsage - memMean) / memStd;

    const anomalies = [];

    if (Math.abs(cpuZ) >= this.zThreshold) {
      anomalies.push({
        type: "CPU_SPIKE",
        zScore: parseFloat(cpuZ.toFixed(2)),
        currentValue: currentSample.cpuUsage,
        baselineMean: parseFloat(cpuMean.toFixed(2)),
        recommendedAction: "TRIGGER_AUTOSCALE_REPLICA",
      });
    }

    if (Math.abs(memZ) >= this.zThreshold) {
      anomalies.push({
        type: "MEMORY_LEAK_LEAKAGE",
        zScore: parseFloat(memZ.toFixed(2)),
        currentValue: currentSample.memoryUsage,
        baselineMean: parseFloat(memMean.toFixed(2)),
        recommendedAction: "SCHEDULE_GRACEFUL_POD_RESTART",
      });
    }

    this.recordObservation(currentSample);

    return {
      hasAnomaly: anomalies.length > 0,
      confidence: anomalies.length > 0 ? 0.94 : 0.0,
      anomalies,
      evaluationTimestamp: new Date().toISOString(),
    };
  }
}

const detector = new TelemetryAnomalyDetector();

module.exports = {
  TelemetryAnomalyDetector,
  detector,
};
