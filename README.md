# CloudPulse 📊
### Containerised Microservices Monitoring Dashboard

![Node.js](https://img.shields.io/badge/Node.js-20.x-green?style=flat-square&logo=node.js)
![Docker](https://img.shields.io/badge/Docker-Compose-blue?style=flat-square&logo=docker)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-NoSQL-47A248?style=flat-square&logo=mongodb)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI%2FCD-2088FF?style=flat-square&logo=github-actions)

---

## Overview

CloudPulse is a **containerised microservices application** with a live monitoring dashboard. It demonstrates real-world Cloud/DevOps practices including service decomposition, container orchestration with Docker Compose, automated CI/CD with GitHub Actions, and real-time observability via a React dashboard.

The system consists of three independent microservices — each containerised, independently deployable, and communicating over a shared Docker network.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Docker Network                        │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Auth Service│  │ Metrics Svc  │  │ Notif. Svc   │  │
│  │  (Port 3001) │  │  (Port 3002) │  │  (Port 3003) │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                 │                  │          │
│         └─────────────────┼──────────────────┘          │
│                           │                             │
│                    ┌──────▼───────┐                     │
│                    │   MongoDB    │                     │
│                    │  (Port 27017)│                     │
│                    └──────────────┘                     │
└─────────────────────────────────────────────────────────┘
           │
    ┌──────▼───────┐
    │ React Dashboard│
    │  (Port 3000)  │
    └───────────────┘
```

---

## Features

- ✅ Three independent microservices (Auth, Metrics, Notifications)
- ✅ Real-time service health monitoring dashboard (React)
- ✅ Container orchestration with Docker Compose
- ✅ CI/CD pipeline with GitHub Actions (lint → test → build → push)
- ✅ Centralised MongoDB with per-service collections
- ✅ JWT-based inter-service authentication
- ✅ Structured JSON logging across all services
- ✅ Automatic container restart policies

---

## Tech Stack

| Component | Technology |
|---|---|
| Services | Node.js 20, Express |
| Dashboard | React 18 |
| Database | MongoDB |
| Containerisation | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Auth | JWT |
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
│   │   │   ├── middleware/       # JWT middleware
│   │   │   └── models/           # Mongoose User model
│   │   ├── Dockerfile
│   │   └── package.json
│   ├── metrics-service/
│   │   ├── src/
│   │   │   ├── index.js          # Express entry point
│   │   │   ├── routes/           # Metrics collection & retrieval
│   │   │   ├── collectors/       # CPU, memory, request stats collectors
│   │   │   └── models/           # Mongoose Metric model
│   │   ├── Dockerfile
│   │   └── package.json
│   └── notification-service/
│       ├── src/
│       │   ├── index.js          # Express entry point
│       │   ├── routes/           # Alert creation & delivery
│       │   └── models/           # Mongoose Notification model
│       ├── Dockerfile
│       └── package.json
├── dashboard/
│   ├── src/
│   │   ├── App.jsx               # Root component
│   │   ├── components/
│   │   │   ├── ServiceCard.jsx   # Per-service health card
│   │   │   ├── MetricsChart.jsx  # Real-time metrics chart
│   │   │   └── AlertFeed.jsx     # Live notification feed
│   │   └── api/                  # API client hooks
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

### Run the Full Stack

```bash
git clone https://github.com/Adithya-Mallepally/CloudPulse.git
cd CloudPulse
docker-compose up --build
```

| Service | URL |
|---|---|
| Dashboard | http://localhost:3000 |
| Auth Service | http://localhost:3001 |
| Metrics Service | http://localhost:3002 |
| Notification Service | http://localhost:3003 |

---

## CI/CD Pipeline

The GitHub Actions pipeline runs on every push to `main`:

```
Push → Lint (ESLint) → Unit Tests → Build Docker Images → Push to GHCR
```

See `.github/workflows/ci-cd.yml` for the full configuration.

---

## Future Work

- [ ] Kubernetes deployment manifests (Helm charts)
- [ ] Prometheus + Grafana integration
- [ ] Distributed tracing with OpenTelemetry
- [ ] Auto-scaling policies

---

## Author

**Roopadithya Vardhan Mallepally**
M.Sc. Software Engineering — BTH Sweden
[GitHub](https://github.com/Adithya-Mallepally) · [LinkedIn](https://linkedin.com/in/roopadithya)
