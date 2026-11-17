import { Budget, createBudgetAction, getUserBudgets } from '@/core';
import { create } from 'zustand';

interface BudgetsState {
    budgets: Budget[];
    isLoading: boolean;
    error: string | null;
}

interface BudgetsActions {
    loadBudgets: () => Promise<void>;
    createBudget: (name: string, amount: number | string) => Promise<boolean>;
    clearError: () => void;
}

type StoreType = BudgetsState & BudgetsActions;

export const useBudgetsStore = create<StoreType>()((set, get) => ({

    budgets: [],
    isLoading: false,
    error: null,

    loadBudgets: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await getUserBudgets();
            if (response) {
                set({ budgets: response, isLoading: false });
            }
        } catch (error) {
            set({ error: 'Error al cargar presupuestos', isLoading: false });
        }
    },

    createBudget: async (name, amount) => {
        set({ isLoading: true, error: null });
        try {
            const newBudget = await createBudgetAction(name, amount);
            if (newBudget) {
                // Recargar la lista completa para asegurar consistencia
                const response = await getUserBudgets();
                if (response) {
                    set({ budgets: response, isLoading: false });
                    return true;
                }
            }
            return false;
        } catch (error) {
            set({ error: 'Error al crear presupuesto', isLoading: false });
            return false;
        }
    },

    clearError: () => set({ error: null })
}));