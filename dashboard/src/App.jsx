import React, { useState, useEffect } from "react";
import { ServiceCard } from "./components/ServiceCard";
import { MetricsChart } from "./components/MetricsChart";
import { AlertFeed } from "./components/AlertFeed";

export function App() {
  const [metrics, setMetrics] = useState({
    cpuUsage: 28.5,
    memoryUsage: 44.2,
    freeMemoryMB: 9120,
    totalMemoryMB: 16384,
  });

  const [alerts, setAlerts] = useState([
    {
      id: "1",
      service: "metrics-service",
      severity: "warning",
      message: "High memory utilization spike observed (>80%)",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "2",
      service: "auth-service",
      severity: "info",
      message: "Health check passed - 0 failed logins in last 10m",
      timestamp: new Date().toISOString(),
    },
  ]);

  return (
    <div className="cloudpulse-app">
      <header className="header">
        <div className="header-brand">
          <h1>CloudPulse <span>Dashboard</span></h1>
          <p className="subtitle">Microservices Telemetry & Health Monitoring</p>
        </div>
        <div className="system-status">
          <span className="live-badge">SYSTEM HEALTHY</span>
        </div>
      </header>

      <main className="content">
        <section className="services-grid">
          <ServiceCard
            name="Auth Service"
            port="3001"
            status="healthy"
            latency="14ms"
            uptime="99.99%"
            details="JWT Authentication & RBAC Service"
          />
          <ServiceCard
            name="Metrics Service"
            port="3002"
            status="healthy"
            latency="9ms"
            uptime="99.95%"
            details="Host Telemetry & Resource Profiler"
          />
          <ServiceCard
            name="Notification Service"
            port="3003"
            status="healthy"
            latency="12ms"
            uptime="99.98%"
            details="Alert Dispatch & Real-Time Events"
          />
        </section>

        <section className="dashboard-columns">
          <MetricsChart {...metrics} />
          <AlertFeed alerts={alerts} />
        </section>
      </main>
    </div>
  );
}

export default App;
