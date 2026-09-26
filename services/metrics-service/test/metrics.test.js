const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/index");

describe("Metrics Service API Suite", () => {
  beforeAll(async () => {
    if (process.env.MONGO_URI) {
      try {
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2000 });
      } catch (_e) {
        // Fallback for offline local test
      }
    }
  });

  afterAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  test("GET /health returns 200 and ok status", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.service).toBe("metrics-service");
  });

  test("GET /metrics/live returns system telemetry stats", async () => {
    const res = await request(app).get("/metrics/live");
    expect(res.statusCode).toBe(200);
    expect(res.body.cpuUsage).toBeDefined();
    expect(res.body.memoryUsage).toBeDefined();
    expect(res.body.uptimeSeconds).toBeDefined();
  });

  test("POST /metrics rejects missing serviceName", async () => {
    const res = await request(app).post("/metrics").send({});
    expect(res.statusCode).toBe(400);
  });

  test("GET /metrics/summary returns current stats", async () => {
    const res = await request(app).get("/metrics/summary");
    expect(res.statusCode).toBe(200);
    expect(res.body.system).toBeDefined();
  });
});
