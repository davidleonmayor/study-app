import type { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";

export class BudgetController {
    constructor() {
        this.getAllUserBudgets = this.getAllUserBudgets.bind(this);
        this.getById = this.getById.bind(this);
        this.create = this.create.bind(this);
        this.updateById = this.updateById.bind(this);
        this.deleteById = this.deleteById.bind(this);
    }

    // GET /api/budgets
    // Frontend espera: Array de budgets con estructura específica
    async getAllUserBudgets(req: Request, res: Response, next: NextFunction) {
        const { user } = req;

        try {
            const userBudgets = await prisma.budget.findMany({
                where: {
                    userId: user.id,
                },
                include: {
                    _count: {
                        select: { expenses: true },
                    },
                },
                orderBy: { createdAt: "desc" },
            });

            // ✅ Transformar datos al formato que espera el frontend
            const budgetsFormatted = userBudgets.map((budget) => ({
                id: budget.id,
                name: budget.name,
                amount: budget.amount.toString(), // Frontend espera string
                userId: budget.userId,
                createdAt: budget.createdAt.toISOString(),
                updatedAt: budget.updatedAt.toISOString(),
                _count: {
                    expenses: budget._count.expenses,
                },
            }));

            return res.status(200).json(budgetsFormatted);
        } catch (error) {
            next(error);
        }
    }

    // GET /api/budgets/:budgetId
    // Frontend espera: Budget con array de expenses
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const budget = req.budget;

            // Obtener gastos del presupuesto
            const expenses = await prisma.expense.findMany({
                where: { budgetId: budget.id },
                orderBy: { createdAt: "desc" },
            });

            // ✅ Transformar al formato que espera el frontend
            const budgetFormatted = {
                id: budget.id,
                name: budget.name,
                amount: budget.amount.toString(), // Frontend espera string
                userId: budget.userId,
                createdAt: budget.createdAt.toISOString(),
                updatedAt: budget.updatedAt.toISOString(),
                expenses: expenses.map((expense) => ({
                    id: expense.id,
                    name: expense.name,
                    amount: expense.amount.toString(), // Frontend espera string
                    budgetId: expense.budgetId,
                    createdAt: expense.createdAt.toISOString(),
                    updatedAt: expense.updatedAt.toISOString(),
                })),
            };

            return res.status(200).json(budgetFormatted);
        } catch (error) {
            next(error);
        }
    }

    // POST /api/budgets
    // Frontend espera: string (mensaje de éxito)
    async create(req: Request, res: Response, next: NextFunction) {
        const { user } = req;
        const { name, amount } = req.body;

        try {
            await prisma.budget.create({
                data: {
                    name,
                    amount,
                    userId: user.id,
                },
            });

            // ✅ Retornar texto plano como espera el frontend
            return res.status(201).send("Presupuesto creado correctamente");
        } catch (error) {
            next(error);
        }
    }

    // PUT /api/budgets/:budgetId
    // Frontend espera: string (mensaje de éxito)
    async updateById(req: Request, res: Response, next: NextFunction) {
        const { budgetId } = req.params;
        const { name, amount } = req.body;

        try {
            await prisma.budget.update({
                where: { id: budgetId },
                data: { name, amount },
            });

            // ✅ Retornar texto plano como espera el frontend
            return res
                .status(200)
                .send("Presupuesto actualizado correctamente");
        } catch (error) {
            next(error);
        }
    }

    // DELETE /api/budgets/:budgetId
    // Frontend espera: string (mensaje de éxito)
    async deleteById(req: Request, res: Response, next: NextFunction) {
        const { budgetId } = req.params;

        try {
            // Primero eliminar todos los gastos asociados
            await prisma.expense.deleteMany({
                where: { budgetId },
            });

            // Luego eliminar el presupuesto
            await prisma.budget.delete({
                where: { id: budgetId },
            });

            // ✅ Retornar texto plano como espera el frontend (status 200, no 204)
            return res.status(200).send("Presupuesto eliminado correctamente");
        } catch (error) {
            next(error);
        }
    }
}

// import type { Request, Response, NextFunction } from "express";
// import { prisma } from "../config/prisma";

// export class BudgetController {
//   constructor() {
//     this.getAllUserBudgets = this.getAllUserBudgets.bind(this);
//     this.getById = this.getById.bind(this);
//     this.create = this.create.bind(this);
//     this.updateById = this.updateById.bind(this);
//     this.deleteById = this.deleteById.bind(this);
//   }

//   async getAllUserBudgets(req: Request, res: Response, next: NextFunction) {
//     const { user } = req;

//     try {
//       // get budgets user
//       const userBudgets = await prisma.budget.findMany({
//         where: {
//           userId: user.id, // ✅ CORRECTO: cambiar ownerId a userId
//         },
//         include: {
//           expenses: {
//             orderBy: { createdAt: "desc" },
//           },
//           _count: {
//             select: { expenses: true },
//           },
//         },
//         orderBy: { createdAt: "desc" },
//       });

//       // Calcular totales para cada presupuesto
//       const budgetsWithTotals = userBudgets.map((budget) => {
//         const totalExpenses = budget.expenses.reduce(
//           (sum, expense) => sum + Number(expense.amount),
//           0
//         );

//         return {
//           ...budget,
//           totalExpenses,
//           remaining: Number(budget.amount) - totalExpenses,
//           progress: ((totalExpenses / Number(budget.amount)) * 100).toFixed(2),
//         };
//       });

//       return res.status(200).json(budgetsWithTotals);
//     } catch (error) {
//       next(error);
//     }
//   }

//   async getById(req: Request, res: Response, next: NextFunction) {
//     try {
//       const budget = req.budget;

//       // Obtener gastos del presupuesto
//       const expenses = await prisma.expense.findMany({
//         where: { budgetId: budget.id },
//         orderBy: { createdAt: "desc" },
//       });

//       // Calcular totales
//       const totalExpenses = expenses.reduce(
//         (sum, expense) => sum + Number(expense.amount),
//         0
//       );

//       return res.status(200).json({
//         ...budget,
//         expenses,
//         totalExpenses,
//         remaining: Number(budget.amount) - totalExpenses,
//         progress: ((totalExpenses / Number(budget.amount)) * 100).toFixed(2),
//       });
//     } catch (error) {
//       next(error);
//     }
//   }

//   async create(req: Request, res: Response, next: NextFunction) {
//     const { user } = req;
//     const { name, amount } = req.body;

//     try {
//       const createdBudget = await prisma.budget.create({
//         data: {
//           name,
//           amount,
//           userId: user.id, // ✅ CORRECTO: usar userId
//         },
//         include: {
//           user: {
//             select: {
//               id: true,
//               name: true,
//               email: true,
//             },
//           },
//         },
//       });

//       return res.status(201).json(createdBudget);
//     } catch (error) {
//       next(error);
//     }
//   }

//   async updateById(req: Request, res: Response, next: NextFunction) {
//     const { budgetId } = req.params;
//     const { name, amount } = req.body;

//     try {
//       const updatedBudget = await prisma.budget.update({
//         where: { id: budgetId },
//         data: { name, amount },
//       });

//       return res.status(200).json(updatedBudget);
//     } catch (error) {
//       next(error);
//     }
//   }

//   async deleteById(req: Request, res: Response, next: NextFunction) {
//     const { budgetId } = req.params;

//     try {
//       await prisma.budget.delete({
//         where: { id: budgetId },
//       });

//       return res.status(204).send("Your budget was deleted successful");
//     } catch (error) {
//       next(error);
//     }
//   }
// }
