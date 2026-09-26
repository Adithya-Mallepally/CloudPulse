import React from "react";

export function MetricsChart({ cpuUsage = 35, memoryUsage = 48, freeMemoryMB = 8192, totalMemoryMB = 16384 }) {
  return (
    <div className="metrics-panel">
      <h2>Live Telemetry</h2>
      <div className="gauges-container">
        <div className="gauge-box">
          <div className="gauge-label">CPU Usage</div>
          <div className="gauge-bar-wrapper">
            <div
              className="gauge-bar-fill fill-cpu"
              style={{ width: `${Math.min(100, Math.max(0, cpuUsage))}%` }}
            ></div>
          </div>
          <div className="gauge-stat">{cpuUsage}%</div>
        </div>

        <div className="gauge-box">
          <div className="gauge-label">Memory Usage</div>
          <div className="gauge-bar-wrapper">
            <div
              className="gauge-bar-fill fill-mem"
              style={{ width: `${Math.min(100, Math.max(0, memoryUsage))}%` }}
            ></div>
          </div>
          <div className="gauge-stat">
            {memoryUsage}% ({Math.round(totalMemoryMB - freeMemoryMB)}MB / {totalMemoryMB}MB)
          </div>
        </div>
      </div>
    </div>
  );
}
