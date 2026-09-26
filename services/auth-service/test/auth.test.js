const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/index");

describe("Auth Service API Suite", () => {
  let isDbConnected = false;

  beforeAll(async () => {
    if (process.env.MONGO_URI) {
      try {
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2000 });
        isDbConnected = true;
      } catch (_e) {
        // Fallback for offline local dev without MongoDB
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
    expect(res.body.service).toBe("auth-service");
  });

  test("POST /auth/register rejects missing payload", async () => {
    const res = await request(app).post("/auth/register").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test("POST /auth/login rejects empty request body", async () => {
    const res = await request(app).post("/auth/login").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  test("GET /auth/verify returns 401 when no token is provided", async () => {
    const res = await request(app).get("/auth/verify");
    expect(res.statusCode).toBe(401);
  });

  test("Database registration and login when connected", async () => {
    if (!isDbConnected) return;

    const testUser = {
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: "Password123!",
      role: "user"
    };

    const regRes = await request(app).post("/auth/register").send(testUser);
    expect(regRes.statusCode).toBe(201);
    expect(regRes.body.token).toBeDefined();

    const loginRes = await request(app).post("/auth/login").send({
      email: testUser.email,
      password: testUser.password
    });
    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body.token).toBeDefined();

    const verifyRes = await request(app)
      .get("/auth/verify")
      .set("Authorization", `Bearer ${loginRes.body.token}`);
    expect(verifyRes.statusCode).toBe(200);
    expect(verifyRes.body.valid).toBe(true);
  });
});
