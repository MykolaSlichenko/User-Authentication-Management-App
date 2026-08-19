"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
describe("Auth API", () => {
    const testUser = {
        email: "test@test.com",
        password: "123456",
    };
    let accessToken = "";
    let refreshToken = "";
    describe("POST /api/auth/register", () => {
        it("should register user", async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/register")
                .send(testUser);
            expect(response.status).toBe(201);
            expect(response.body.user.email).toBe(testUser.email);
        });
        it("should reject duplicate email", async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/register")
                .send(testUser);
            expect(response.status).toBe(409);
        });
    });
    describe("POST /api/auth/login", () => {
        it("should login successfully", async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/login")
                .send(testUser);
            expect(response.status).toBe(200);
            expect(response.body.accessToken)
                .toBeDefined();
            expect(response.body.refreshToken)
                .toBeDefined();
            accessToken =
                response.body.accessToken;
            refreshToken =
                response.body.refreshToken;
        });
        it("should reject wrong password", async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/login")
                .send({
                email: testUser.email,
                password: "wrongpassword",
            });
            expect(response.status).toBe(401);
        });
    });
    describe("GET /api/auth/me", () => {
        it("should reject without token", async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .get("/api/auth/me");
            expect(response.status).toBe(401);
        });
        it("should return current user", async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .get("/api/auth/me")
                .set("Authorization", `Bearer ${accessToken}`);
            expect(response.status).toBe(200);
            expect(response.body.user.email).toBe(testUser.email);
        });
    });
    describe("POST /api/auth/refresh", () => {
        it("should refresh access token", async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/refresh")
                .send({
                refreshToken,
            });
            expect(response.status).toBe(200);
            expect(response.body.accessToken)
                .toBeDefined();
        });
    });
    describe("POST /api/auth/logout", () => {
        it("should logout successfully", async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/logout")
                .send({
                refreshToken,
            });
            expect(response.status).toBe(200);
        });
        it("should reject refresh after logout", async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post("/api/auth/refresh")
                .send({
                refreshToken,
            });
            expect(response.status).toBe(401);
        });
    });
});
