import type { Application } from "express";
import { AuthRoutes } from "./auth/auth.routes";
import { BudgetRoutes } from "./budget/budget.routes";
import { ExpenseRoutes } from "./expense/expense.routes";

export default class Routes {
    public static init(app: Application) {
        const authRoutes = new AuthRoutes();
        const budgetRoutes = new BudgetRoutes();
        const expenseRoutes = new ExpenseRoutes();

        authRoutes.initRoutes();
        budgetRoutes.initRoutes();
        expenseRoutes.initRoutes();

        app.use("/api/auth", authRoutes.router);
        app.use("/api/budgets", budgetRoutes.router);
        app.use("/api/budgets/:budgetId/expenses", expenseRoutes.router);
    }
}
