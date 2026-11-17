import { Router } from "express";

import { BudgetController } from "./budget.controller";
import { ExpenseController } from "../expense/expense.controller";

import { AuthMiddleware } from "../common/middleware/AuthMiddleware";
import { BudgetMiddleware } from "../common/middleware/BudgetMiddleware";
import { ExpenseMiddleware } from "../common/middleware/ExpenseMiddleware";

import { validateSchema } from "../common/middleware/validateSchema";

import {
    BudgetIdSchema,
    BudgetSchema,
    BudgetPutSchema,
    BudgetDeleteSchema,
} from "./budget.schema";

import {
    ExpensePostSchema,
    ExpenseGetByIdSchema,
    ExpensePutSchema,
    ExpenseDeleteSchema,
} from "../expense/expense.schema";

export class BudgetRoutes {
    private authMiddleware: AuthMiddleware;
    private budgetMiddleware: BudgetMiddleware;
    private expenseMiddleware: ExpenseMiddleware;

    private budgetController: BudgetController;
    private expenseController: ExpenseController;

    public router: Router;

    constructor() {
        this.budgetController = new BudgetController();
        this.expenseController = new ExpenseController();

        this.authMiddleware = new AuthMiddleware();
        this.budgetMiddleware = new BudgetMiddleware();
        this.expenseMiddleware = new ExpenseMiddleware();

        this.router = Router();
        this.initRoutes();
    }

    public initRoutes() {
        // ========== BUDGET ROUTES ==========

        // GET /api/budgets - Obtener todos los presupuestos del usuario
        this.router.get(
            "/",
            this.authMiddleware.isAuthenticatedUser,
            this.budgetController.getAllUserBudgets,
        );

        // GET /api/budgets/:budgetId - Obtener un presupuesto por ID
        this.router.get(
            "/:budgetId",
            validateSchema(BudgetIdSchema),
            this.authMiddleware.isAuthenticatedUser,
            this.budgetMiddleware.validateBudgetOwnership,
            this.budgetController.getById,
        );

        // POST /api/budgets - Crear un nuevo presupuesto
        this.router.post(
            "/",
            validateSchema(BudgetSchema),
            this.authMiddleware.isAuthenticatedUser,
            this.budgetController.create,
        );

        // PUT /api/budgets/:budgetId - Actualizar un presupuesto
        this.router.put(
            "/:budgetId",
            validateSchema(BudgetPutSchema),
            this.authMiddleware.isAuthenticatedUser,
            this.budgetMiddleware.validateBudgetOwnership,
            this.budgetController.updateById,
        );

        // DELETE /api/budgets/:budgetId - Eliminar un presupuesto
        this.router.delete(
            "/:budgetId",
            validateSchema(BudgetDeleteSchema),
            this.authMiddleware.isAuthenticatedUser,
            this.budgetMiddleware.validateBudgetOwnership,
            this.budgetController.deleteById,
        );
    }
}
