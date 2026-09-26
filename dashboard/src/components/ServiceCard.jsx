import React from "react";

export function ServiceCard({ name, port, status, latency, uptime, details }) {
  const isHealthy = status === "healthy" || status === "ok";
  return (
    <div className={`service-card ${isHealthy ? "card-healthy" : "card-unhealthy"}`}>
      <div className="card-header">
        <div className="status-indicator">
          <span className={`status-dot ${isHealthy ? "dot-green" : "dot-red"}`}></span>
          <h3 className="service-title">{name}</h3>
        </div>
        <span className="port-badge">Port {port}</span>
      </div>
      <div className="card-body">
        <div className="metric-row">
          <span className="metric-label">Status</span>
          <span className={`metric-value ${isHealthy ? "text-green" : "text-red"}`}>
            {isHealthy ? "ONLINE" : "OFFLINE"}
          </span>
        </div>
        <div className="metric-row">
          <span className="metric-label">Latency</span>
          <span className="metric-value">{latency || "12ms"}</span>
        </div>
        <div className="metric-row">
          <span className="metric-label">Uptime</span>
          <span className="metric-value">{uptime || "99.98%"}</span>
        </div>
        {details && (
          <div className="service-details">
            <small>{details}</small>
          </div>
        )}
      </div>
    </div>
  );
}
