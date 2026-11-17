import { useAuthStore } from '@/presentation';
import { Redirect, Slot } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";


export default function CheckAuthenticationLayout() {

    //CheckAuth
    const status = useAuthStore(state => state.status);
    const checkAuth = useAuthStore(state => state.checkAuth);

    useEffect(() => {
        checkAuth()
    }, []);

    //Muestra un estado de carga si el estado se esta verificando
    if (status === 'checking') {
        return (
            <View className='flex-1 justify-center items-center bg-primary'>
                <ActivityIndicator color="white" size={50} />
                <Text>{status}</Text>
            </View>
        );
    }

    //Retorna al auth si no esta autenticado
    if (status === 'unauthenticated') {
        return <Redirect href="/auth/login" />
    }


    if (status === 'authenticated') {
        return (
            <SafeAreaView className='flex-1'>
                <Slot />
            </SafeAreaView>
        )

    }

    return null;

}