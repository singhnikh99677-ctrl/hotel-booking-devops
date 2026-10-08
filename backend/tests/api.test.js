const request = require("supertest");
const app = require("../src/server");

describe("Basic API tests", () => {
  test("root endpoint responds", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toContain("Hotel Booking API");
  });

  test("health endpoint responds", async () => {
    const response = await request(app).get("/api/health");
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("UP");
  });
});
