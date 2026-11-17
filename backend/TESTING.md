# Backend Testing Guide

This document provides instructions on how to run the backend tests and explains the testing strategy and tools used.

## Running the Tests

To run the tests, navigate to the `backend` directory and use the following command:

```bash
pnpm test
```

This command will execute all the test files ending with `.test.ts` inside the `src` directory.

### Test Environment

The tests run in a separate test environment. The configuration for this environment is defined in the `.env.test` file. This file contains the necessary environment variables for the tests, such as the database connection string for a test database and a JWT secret.

## Testing Strategy

The testing strategy for the backend is a combination of unit and integration tests.

*   **Unit Tests**: These tests focus on individual functions and modules in isolation. For example, the `password` utility functions are tested as pure functions without any external dependencies.

*   **Integration Tests**: These tests focus on the interaction between different parts of the application, such as the controllers, services, and middlewares. For these tests, we use `supertest` to make HTTP requests to the Express application and assert the responses.

### Why Supertest?

`supertest` is a library that allows us to make HTTP requests to an Express application without having to start a real server. This makes it ideal for testing the controllers and the entire request-response cycle in an automated way.

By using `supertest`, we can:

*   Test the routes and their handlers.
*   Verify the request validation schemas.
*   Assert the HTTP status codes and the response bodies.
*   Test the middlewares and their behavior.

### Mocking

To isolate the tests from external dependencies, we use mocking.

*   **Prisma Client**: The Prisma client is mocked using `jest.mock` to prevent the tests from hitting a real database. This allows us to control the data returned by the database and to test the application's logic without having to manage a test database.

*   **Email Service**: The `AuthEmail` module is also mocked to prevent the tests from sending real emails.

*   **Middlewares**: Middlewares like `AuthMiddleware` and `BudgetMiddleware` are mocked to simulate an authenticated user and to bypass certain checks that are not relevant to the test being performed.
