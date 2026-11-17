import { useBudgetsStore } from '@/presentation/budgets/store/use-budgets-store';
import { BudgetCard } from '@/presentation/components/BudgetCard';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

const BudgetsScreen = () => {
  const router = useRouter();

  // Obtenemos datos y loading del store
  const { budgets, isLoading, loadBudgets } = useBudgetsStore();

  // Recargar cuando la pantalla recibe foco
  useFocusEffect(
    useCallback(() => {
      loadBudgets();
    }, [])
  );

  if (isLoading && budgets.length === 0) {
    return (
      <View className='flex-1 items-center justify-center'>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className='mt-4'>Cargando presupuestos...</Text>
      </View>
    );
  }

  return (
    <View className='flex-1'>
      <View className='items-center pt-5'>
        <Text className='text-2xl font-bold'>Mis Presupuestos</Text>
        <Text className='text-[15px]'>
          Maneja y administra tus <Text className='font-bold text-primaryDark'>presupuestos</Text>
        </Text>
      </View>

      <ScrollView className='flex-1 px-4 mt-5'>
        {budgets.length === 0 ? (
          <View className='items-center justify-center mt-10'>
            <Text className='text-lg text-gray-500'>No hay presupuestos creados</Text>
            <Text className='text-gray-400'>Crea tu primer presupuesto</Text>
          </View>
        ) : (
          budgets.map((budget) => (
            <BudgetCard data={budget} key={budget.id} />
          ))

        )}
      </ScrollView>

      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push('/create-budget-form');
        }}
        className='absolute bottom-24 right-5 rounded-full bg-primary active:bg-primaryDark h-20 w-20 flex items-center justify-center shadow-lg'
      >
        <Text className='text-4xl text-white'>+</Text>
      </Pressable>
    </View>
  );
};

export default BudgetsScreen;