# CloudPulse
### Containerised Microservices Monitoring & Predictive Anomaly Telemetry Dashboard

---

## Overview

CloudPulse is a production-oriented microservices monitoring platform and telemetry dashboard. It demonstrates real-world Cloud/DevOps practices including service decomposition, container orchestration with Docker Compose, automated CI/CD with GitHub Actions, real-time observability via a React dashboard, and predictive statistical anomaly detection.

---

## Unique Key Feature: Real-Time Telemetry Anomaly Detection

Beyond basic static metric dashboards, CloudPulse includes an integrated statistical anomaly detection engine:
- Moving Z-Score Telemetry Analysis: Continuously evaluates rolling CPU and memory distributions over configurable time windows.
- Proactive Threshold Alerts: Identifies abnormal memory leak trajectories and unexpected CPU throttling before cluster failures occur.
- Automated Remediation Recommendations: Output includes targeted DevOps actions (e.g., TRIGGER_AUTOSCALE_REPLICA, SCHEDULE_GRACEFUL_POD_RESTART).
- Accessible via the `/metrics/anomalies` REST API endpoint and the interactive dashboard.

---

## Architecture

```
+---------------------------------------------------------+
|                    Docker Network                       |
|                                                         |
|  +--------------+  +--------------+  +---------------+  |
|  | Auth Service |  | Metrics Svc  |  |  Notif. Svc   |  |
|  | (Port 3001)  |  | (Port 3002)  |  | (Port 3003)   |  |
|  +-------+------+  +-------+------+  +-------+-------+  |
|          |                 |                 |          |
|          +-----------------+-----------------+          |
|                            |                            |
|                     +------v-------+                    |
|                     |   MongoDB    |                    |
|                     | (Port 27017) |                    |
|                     +--------------+                    |
+---------------------------------------------------------+
                           |
                    +------v-------+
                    |React Dashboard|
                    | (Port 3000)  |
                    +--------------+
```

---

## Features

- Three independent microservices: Auth, Metrics, and Notifications
- Statistical time-series anomaly detection engine (Z-score analysis)
- Real-time service health monitoring dashboard built with React
- Container orchestration with Docker Compose
- CI/CD pipeline with GitHub Actions (lint, test, build, push)
- Centralized MongoDB with per-service collections and offline resilient fallbacks
- JWT-based inter-service authentication
- Structured JSON logging across all microservices using Winston
- Automatic container restart policies

---

## Tech Stack

| Component | Technology |
|---|---|
| Services | Node.js 20, Express |
| Dashboard | React 18, Express static runner |
| Database | MongoDB, Mongoose |
| Containerisation | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Auth | JWT, bcryptjs |
| Anomaly Detection | Statistical moving Z-score analyzer |
| Logging | Winston |

---

## Project Structure

```
CloudPulse/
├── services/
│   ├── auth-service/
│   │   ├── src/
│   │   │   ├── index.js          # Express entry point
│   │   │   ├── routes/           # Auth routes (register, login, verify)
│   │   │   ├── middleware/       # JWT verification middleware
│   │   │   └── models/           # Mongoose User model
│   │   ├── test/                 # Jest & Supertest suites
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── metrics-service/
│   │   ├── src/
│   │   │   ├── index.js          # Express entry point
│   │   │   ├── routes/           # Metrics collection & anomalies endpoint
│   │   │   ├── collectors/       # Host telemetry & anomaly detector
│   │   │   └── models/           # Mongoose Metric model
│   │   ├── test/                 # Telemetry & anomaly test suites
│   │   ├── Dockerfile
│   │   └── package.json
│   └── notification-service/
│       ├── src/
│       │   └── index.js          # Express entry point & alert routes
│       ├── Dockerfile
│       └── package.json
├── dashboard/
│   ├── src/
│   │   ├── App.jsx               # Root dashboard component
│   │   └── components/           # ServiceCard, MetricsChart, AlertFeed
│   ├── public/                   # Production index.html
│   ├── server.js                 # Static dashboard runner
│   ├── Dockerfile
│   └── package.json
├── .github/
│   └── workflows/
│       └── ci-cd.yml             # GitHub Actions pipeline
├── docker-compose.yml
└── README.md
```

---

## Getting Started

### Run with Docker Compose

```bash
docker-compose up --build
```

| Service | URL |
|---|---|
| Dashboard | http://localhost:3000 |
| Auth Service | http://localhost:3001 |
| Metrics Service | http://localhost:3002 |
| Notification Service | http://localhost:3003 |

### Run Locally (Example: Metrics Service)

```bash
cd services/metrics-service
npm install
npm test
npm start
```

---

## CI/CD Pipeline

The GitHub Actions pipeline runs on every push to main:

Lint (ESLint) -> Unit Tests (Jest) -> Build Docker Images -> Push to GHCR

See `.github/workflows/ci-cd.yml` for configuration.

---

## Author

Roopadithya Vardhan Mallepally
M.Sc. Software Engineering - BTH Sweden
GitHub: https://github.com/Adithya-Mallepally
