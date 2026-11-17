import { Budget } from '@/core';
import React from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { BudgetCard } from './BudgetCard';

interface BudgetListProps {
    budgets: Budget[];
}

/**
 * @deprecated Esta lista no es compatible con ScrollView y puede causar problemas de virtualización.
 * Usa un BudgetCard directamente en la pantalla.
 */
export function BudgetList({ budgets }: BudgetListProps) {
    return (
        <FlatList
            data={budgets}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <BudgetCard data={item} />
            )}

        />
    )
}