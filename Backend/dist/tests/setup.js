"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockedPrisma = void 0;
process.env.JWT_SECRET = "test-secret-key";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret-key";
// Store users in memory for testing
const mockUsers = new Map();
const mockUsersById = new Map();
const mockTokens = [];
exports.mockedPrisma = {
    user: {
        findUnique: jest.fn().mockImplementation(async ({ where }) => {
            if (where.email) {
                return mockUsers.get(where.email) || null;
            }
            if (where.id) {
                return mockUsersById.get(where.id) || null;
            }
            return null;
        }),
        create: jest.fn().mockImplementation(async ({ data }) => {
            const user = {
                id: `test-${Date.now()}`,
                email: data.email,
                password: data.password,
                createdAt: new Date().toISOString(),
            };
            mockUsers.set(data.email, user);
            mockUsersById.set(user.id, user);
            return user;
        }),
    },
    refreshToken: {
        create: jest.fn().mockImplementation(async (data) => {
            const token = {
                id: `token-${Date.now()}`,
                ...data.data,
            };
            mockTokens.push(token);
            return token;
        }),
        findUnique: jest.fn().mockImplementation(async ({ where }) => {
            return mockTokens.find(t => t.token === where.token) || null;
        }),
        delete: jest.fn().mockImplementation(async ({ where }) => {
            const index = mockTokens.findIndex(t => t.token === where.token);
            if (index > -1) {
                const deleted = mockTokens.splice(index, 1)[0];
                return deleted;
            }
            return null;
        }),
    },
};
beforeAll(() => {
    mockUsers.clear();
    mockUsersById.clear();
    mockTokens.length = 0;
    jest.clearAllMocks();
});
jest.mock("../config/prisma", () => ({
    __esModule: true,
    default: exports.mockedPrisma,
}));
beforeAll(async () => {
    console.log("Starting tests...");
});
afterAll(async () => {
    console.log("Tests finished");
});
