import { Router } from "express";

import { AuthController } from "../auth/auth.controller";
import { ExpenseController } from "./expense.controller";
import {
    ExpensePostSchema,
    ExpenseGetByIdSchema,
    ExpenseDeleteSchema,
    ExpensePutSchema,
} from "./expense.schema";

import { AuthMiddleware } from "../common/middleware/AuthMiddleware";
import { BudgetMiddleware } from "../common/middleware/BudgetMiddleware";
import { ExpenseMiddleware } from "../common/middleware/ExpenseMiddleware";
import { validateSchema } from "../common/middleware/validateSchema";

export class ExpenseRoutes {
    private authController: AuthController;
    private expenseController: ExpenseController;

    private authMiddleware: AuthMiddleware;
    private budgetMiddleware: BudgetMiddleware;
    private expenseMiddleware: ExpenseMiddleware;

    public router: Router;

    constructor() {
        this.router = Router({ mergeParams: true });
        this.authMiddleware = new AuthMiddleware();
        this.budgetMiddleware = new BudgetMiddleware();
        this.expenseMiddleware = new ExpenseMiddleware();

        this.expenseController = new ExpenseController();

        this.initRoutes();
    }

    initRoutes() {
        // ========== EXPENSE ROUTES ==========

        // POST /api/budgets/:budgetId/expenses - Crear un gasto en un presupuesto
        this.router.post(
            "/",
            validateSchema(ExpensePostSchema),
            this.authMiddleware.isAuthenticatedUser,
            this.budgetMiddleware.validateBudgetOwnership,
            this.expenseController.create,
        );

        // GET /api/budgets/:budgetId/expenses/:expenseId - Obtener un gasto específico
        this.router.get(
            "/expenseId",
            validateSchema(ExpenseGetByIdSchema),
            this.authMiddleware.isAuthenticatedUser,
            this.budgetMiddleware.validateBudgetOwnership,
            this.expenseMiddleware.validateExpenseBelongsToBudget,
            this.expenseController.getById,
        );

        // PUT /api/budgets/:budgetId/expenses/:expenseId - Actualizar un gasto
        this.router.put(
            "/:expenseId",
            validateSchema(ExpensePutSchema),
            this.authMiddleware.isAuthenticatedUser,
            this.budgetMiddleware.validateBudgetOwnership,
            this.expenseMiddleware.validateExpenseBelongsToBudget,
            this.expenseController.updateById,
        );

        // DELETE /api/budgets/:budgetId/expenses/:expenseId - Eliminar un gasto
        this.router.delete(
            "/:expenseId",
            validateSchema(ExpenseDeleteSchema),
            this.authMiddleware.isAuthenticatedUser,
            this.budgetMiddleware.validateBudgetOwnership,
            this.expenseMiddleware.validateExpenseBelongsToBudget,
            this.expenseController.deleteById,
        );
    }
}
