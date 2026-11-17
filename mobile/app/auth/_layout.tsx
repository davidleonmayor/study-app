import { Slot } from 'expo-router';
import React from 'react';
import { Image, KeyboardAvoidingView, ScrollView, View } from 'react-native';

export default function AuthLayout() {



    return (
        //Desplazar el texto hacia arriba al abrir el teclado 
        <KeyboardAvoidingView
            behavior="padding"
            className="flex-1 bg-white"
        >
            <View className='flex justify-center items-center h-20 bg-primary'>

                <Image
                    source={require("@/assets/images/logo.png")}
                    style={{ width: 200, height: 200 }}
                    resizeMode="contain"
                />
            </View>

            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: "center", alignItems: "center" }}
                keyboardShouldPersistTaps="handled"
            >
                <Slot />
            </ScrollView>
        </KeyboardAvoidingView>
    )
}