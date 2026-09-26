import React from "react";

export function AlertFeed({ alerts = [] }) {
  return (
    <div className="alert-panel">
      <h2>Recent Service Alerts</h2>
      <div className="alert-list">
        {alerts.length === 0 ? (
          <div className="empty-alerts">All systems operating within normal parameters.</div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className={`alert-item alert-${alert.severity || "info"}`}>
              <div className="alert-top">
                <span className="alert-service">{alert.service}</span>
                <span className="alert-time">{new Date(alert.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="alert-message">{alert.message}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
