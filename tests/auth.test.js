import request from "supertest";
import { it, expect, beforeAll, afterAll, describe } from "@jest/globals";
import app from "../src/app.js";
import mongoose from "mongoose";
import User from "../src/models/User.js";
import { login } from "../src/controllers/authController.js";

const testMail = "test-login@example.com";
beforeAll(async () => {
  if (mongoose.connection.name !== "lms_test_db") {
    throw new Error("Wrong database");
  }
  await User.deleteOne({ email: testMail });
});

describe("Authentication", () => {
  it("POST /api/auth/register ", async () => {
    const response = await request(app).post("/api/auth/register").send({
      fullName: "test_amin",
      email: testMail,
      password: "test",
      role: "admin",
    });
    expect(response.status).toBe(201);
    const user = await User.findOne({
      email: testMail,
    });
    expect(user).not.toBeNull();
    expect(user.role).toBe("learner");
  });
  it("Post  /api/auth/login", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: testMail,
      password: "test",
    });
    const token = response.body.token;
    const courseResponse = await request(app)
      .post("/api/courses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Course",
        description: "Testing RBAC",
      });

    expect(courseResponse.status).toBe(403);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("login success");
    expect(response.body.token).toEqual(expect.any(String));
  });
  it("POST /api/auth/login wiith wrong password", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: testMail,
      password: "wrong password",
    });
    expect(response.status).toBe(403);
  });
  it("GET /api/auth/me without token", async () => {
    const response = await request(app).get("/api/auth/me");
    expect(response.status).toBe(401);
  });
  it("GET /api/auth/me with valid JWT", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: testMail,
      password: "test",
    });
    //   expect(loginResponse.status).toBe(200);
    //   expect(loginResponse.body.message).toBe("login success");
    const token = loginResponse.body.token;
    expect(loginResponse.body.token).toEqual(expect.any(String));
    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
  it("shold reject login for inactive users", async () => {
    try {
      await User.updateOne({ email: testMail }, { $set: { status: false } });
      const response = await request(app).post("/api/auth/login").send({
        email: testMail,
        password: "test",
      });
      expect(response.status).toBe(403);
      expect(response.body.message).toBe("Your account is Inactive");
    } finally {
      await User.updateOne({ email: testMail }, { $set: { status: true } });
    }
  });
  it("should reject an existing JWWT after account desactivation", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: testMail,
      password: "test",
    });
    expect(loginResponse.status).toBe(200);
    const token = loginResponse.body.token;

    try {
      await User.updateOne({ email: testMail }, { $set: { status: false } });
      const response = await request(app)
        .get("/api/auth/me")
        .set("authorization", `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toBe("access forbiden");
    } finally {
      await User.updateOne({ email: testMail }, { $set: { status: true } });
    }
  });
});
