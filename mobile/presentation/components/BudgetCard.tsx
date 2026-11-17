import { Budget } from '@/core';
import React from 'react';
import { Text, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

interface BudgetCardProps {
  data: Budget
}

export function BudgetCard({ data }: BudgetCardProps) {

  const updatedDate = new Date(data.updatedAt).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formatedAmount = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP'
  }).format(data.amount);

  return (
    
    <Swipeable>

      <View className='mb-2 w-[380px] bg-gray-100 p-10 rounded-lg shadow-2xl'>

        <Text className='text-left text-2xl font-bold'>
          {data.name}
        </Text>

        <Text className='text-xl text-primaryDark font-bold'>
           {formatedAmount}
        </Text>

        <View className='flex flex-row gap-1'>
          <Text className='text-gray-500'>Ultima actualización:</Text>
          <Text className='font-bold  text-gray-600'>{updatedDate}</Text>
        </View>

      </View>
    </Swipeable>
  )
}