import type { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";

export class ExpenseController {
  constructor() {
    this.create = this.create.bind(this);
    this.getById = this.getById.bind(this);
    this.updateById = this.updateById.bind(this);
    this.deleteById = this.deleteById.bind(this);
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const { budget } = req;
    const { name, amount } = req.body;

    try {
      const expense = await prisma.expense.create({
        data: {
          name,
          amount,
          budgetId: budget.id,
        },
        include: {
          budget: {
            select: {
              id: true,
              name: true,
              amount: true,
            },
          },
        },
      });

      return res.status(201).json({
        message: "Gasto agregado correctamente",
        expense,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { expense } = req;

      return res.status(200).json(expense);
    } catch (error) {
      next(error);
    }
  }

  async updateById(req: Request, res: Response, next: NextFunction) {
    const { expenseId } = req.params;
    const { name, amount } = req.body;

    try {
      const updatedExpense = await prisma.expense.update({
        where: { id: expenseId },
        data: { name, amount },
        include: {
          budget: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return res.status(200).json({
        message: "Gasto actualizado correctamente",
        expense: updatedExpense,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteById(req: Request, res: Response, next: NextFunction) {
    const { expenseId } = req.params;

    try {
      await prisma.expense.delete({
        where: { id: expenseId },
      });

      return res.status(200).json({
        message: "Gasto eliminado correctamente",
      });
    } catch (error) {
      next(error);
    }
  }
}
