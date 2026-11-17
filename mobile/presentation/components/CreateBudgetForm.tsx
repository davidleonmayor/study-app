import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import { useBudgetsStore } from '../budgets/store/use-budgets-store';
import { ErrorMessage } from './ErrorMessage';
import { InputControl } from './InputControl';

export const CreateBudgetForm = () => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: '',
            amount: ''
        }
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const createBudget = useBudgetsStore(state => state.createBudget);
    const router = useRouter();

    const handleCreateBudget = async (data: { name: string, amount: string }) => {
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        
        try {
            const amountNumber = parseFloat(data.amount);
            if (isNaN(amountNumber)) {
                Alert.alert('Error', 'La cantidad debe ser un número válido');
                return;
            }

            const success = await createBudget(data.name, amountNumber);
            
            if (success) {
                router.back(); // Navegar de vuelta después de crear
            } else {
                Alert.alert('Error', 'No se pudo crear el presupuesto');
            }
        } catch (error) {
            Alert.alert('Error', 'Ocurrió un error al crear el presupuesto');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <View
            className='mt-10 bg-white p-10 rounded-xl w-full flex items-center mx-12'
            style={{
                shadowColor: "000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 1
            }}
        >
            <Text className='font-bold text-left w-full'>Nombre Presupuesto</Text>
            <InputControl
                name='name'
                control={control}
                placeholder='Nombre del presupuesto'
                className='w-full mt-2'
                rules={{
                    required: 'El nombre del presupuesto es obligatorio'
                }}
            />
            {errors.name && <ErrorMessage errorText={errors.name.message} />}

            <Text className='font-bold text-left w-full mt-5'>Cantidad Presupuesto</Text>
            <InputControl
                name='amount'
                control={control}
                placeholder='Cantidad del presupuesto'
                className='w-full mt-2'
                keyboardType='numeric'
                rules={{
                    required: 'La cantidad es obligatoria',
                    min: { value: 0, message: 'La cantidad debe ser mayor a 0' }
                }}
            />
            {errors.amount && <ErrorMessage errorText={errors.amount.message} />}

            <Pressable

                onPress={handleSubmit(handleCreateBudget)}
                disabled={isSubmitting}
                className='rounded-xl shadow-xl bg-primary p-5 mt-5 w-full active:bg-primaryDark disabled:opacity-80'
            >
                {isSubmitting ? (
                    <ActivityIndicator color="black" />
                ) : (
                    <Text className='text-center font-bold text-black uppercase'>Crear Presupuesto</Text>
                )}
            </Pressable>
        </View>
    )
}