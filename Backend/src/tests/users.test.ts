import request from "supertest";
import app from "../app";

describe("Users API", () => {
  const testUser = {
    email: "users@test.com",
    password: "123456",
    firstName: "Users",
    lastName: "Tester",
    acceptedTerms: true,
  };

  let accessToken = "";

  beforeAll(async () => {
    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(registerResponse.status).toBe(201);

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send(testUser);

    expect(loginResponse.status).toBe(200);
    accessToken = loginResponse.body.accessToken;
  });

  describe("GET /api/users", () => {
    it("should return all users for authenticated user", async () => {
      const response = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.users)).toBe(true);
      expect(response.body.users.length).toBeGreaterThan(0);
      expect(response.body.users.some((user: any) => user.email === testUser.email)).toBe(true);
    });

    it("should reject without token", async () => {
      const response = await request(app)
        .get("/api/users");

      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/users/:id", () => {
    it("should return a single user by id", async () => {
      const listResponse = await request(app)
        .get("/api/users")
        .set("Authorization", `Bearer ${accessToken}`);

      const userId = listResponse.body.users.find((user: any) => user.email === testUser.email).id;

      const response = await request(app)
        .get(`/api/users/${userId}`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user.id).toBe(userId);
    });

    it("should return 404 for non-existent user", async () => {
      const response = await request(app)
        .get("/api/users/non-existent-id")
        .set("Authorization", `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("User not found");
    });
  });
});
