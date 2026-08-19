type MockedPrismaUser = {
  findUnique: jest.Mock;
  findMany: jest.Mock;
  create: jest.Mock;
};

process.env.JWT_SECRET = "test-secret-key";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret-key";

// Store users in memory for testing
const mockUsers: Map<string, any> = new Map();
const mockUsersById: Map<string, any> = new Map();
const mockTokens: any[] = [];

export const mockedPrisma = {
  user: {
    findUnique: jest.fn().mockImplementation(async ({ where }: any) => {
      if (where.email) {
        return mockUsers.get(where.email) || null;
      }
      if (where.id) {
        return mockUsersById.get(where.id) || null;
      }
      return null;
    }),
    findMany: jest.fn().mockImplementation(async () => {
      return Array.from(mockUsersById.values());
    }),
    create: jest.fn().mockImplementation(async ({ data }: any) => {
      const user = {
        id: `test-${Date.now()}`,
        email: data.email,
        password: data.password,
        firstName: data.firstName ?? "",
        lastName: data.lastName ?? "",
        acceptedTerms: data.acceptedTerms ?? false,
        createdAt: new Date().toISOString(),
      };
      mockUsers.set(data.email, user);
      mockUsersById.set(user.id, user);
      return user;
    }),
  } as MockedPrismaUser,
  refreshToken: {
    create: jest.fn().mockImplementation(async (data: any) => {
      const token = {
        id: `token-${Date.now()}`,
        ...data.data,
      };
      mockTokens.push(token);
      return token;
    }),
    findUnique: jest.fn().mockImplementation(async ({ where }: any) => {
      return mockTokens.find(t => t.token === where.token) || null;
    }),
    delete: jest.fn().mockImplementation(async ({ where }: any) => {
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
  default: mockedPrisma,
}));

beforeAll(async () => {
  console.log("Starting tests...");
});

afterAll(async () => {
  console.log("Tests finished");
});