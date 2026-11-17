import request from 'supertest';
import Server from '@backend/server';
import { prisma } from '@backend/config/prisma';

// Mock the AuthMiddleware
jest.mock('@backend/common/middleware/AuthMiddleware', () => ({
  AuthMiddleware: jest.fn().mockImplementation(() => ({
    isAuthenticatedUser: (req, res, next) => {
      req.user = { id: '1', email: 'test@example.com' };
      next();
    },
  })),
}));

// Mock the BudgetMiddleware
jest.mock('@backend/common/middleware/BudgetMiddleware', () => ({
  BudgetMiddleware: jest.fn().mockImplementation(() => ({
    validateBudgetOwnership: (req, res, next) => {
      req.budget = { id: '1', userId: '1', name: 'Test Budget' };
      next();
    },
  })),
}));

// Mock the prisma client
jest.mock('@backend/config/prisma', () => ({
  prisma: {
    budget: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    expense: {
      findMany: jest.fn(),
    },
  },
}));

const server = new Server();
const app = server['app'];

describe('Budget Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/budget', () => {
    it('should return all budgets for a user', async () => {
      const budgets = [
        {
          id: '1',
          name: 'Test Budget',
          amount: 1000,
          userId: '1',
          expenses: [],
          _count: { expenses: 0 },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (prisma.budget.findMany as jest.Mock).mockResolvedValue(budgets);

      const response = await request(app).get('/api/budget');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Test Budget');
    });
  });

  describe('GET /api/budget/:budgetId', () => {
    it('should return a budget by id', async () => {
      const budget = {
        id: '1',
        name: 'Test Budget',
        amount: 1000,
        userId: '1',
        expenses: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.expense.findMany as jest.Mock).mockResolvedValue([]);

      const response = await request(app).get('/api/budget/1');

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Test Budget');
    });
  });

  describe('POST /api/budget', () => {
    it('should create a new budget', async () => {
      const budgetData = { name: 'New Budget', amount: 2000 };
      const budget = { id: '2', ...budgetData, userId: '1', createdAt: new Date(), updatedAt: new Date() };

      (prisma.budget.create as jest.Mock).mockResolvedValue(budget);

      const response = await request(app).post('/api/budget').send(budgetData);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('New Budget');
    });
  });

  describe('PUT /api/budget/:budgetId', () => {
    it('should update a budget', async () => {
      const budgetData = { name: 'Updated Budget', amount: 2500 };
      const budget = { id: '1', ...budgetData, userId: '1', createdAt: new Date(), updatedAt: new Date() };

      (prisma.budget.update as jest.Mock).mockResolvedValue(budget);

      const response = await request(app).put('/api/budget/1').send(budgetData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Budget');
    });
  });

  describe('DELETE /api/budget/:budgetId', () => {
    it('should delete a budget', async () => {
      (prisma.budget.delete as jest.Mock).mockResolvedValue({});

      const response = await request(app).delete('/api/budget/1');

      expect(response.status).toBe(204);
    });
  });
});
