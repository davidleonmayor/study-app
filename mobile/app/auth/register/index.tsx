import { RegisterForm } from '@/presentation';
import { Link } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

export default function RegisterScreen() {

  return (
    <View className="flex-1 items-center justify-center px-6 bg-white">
      {/* Encabezado */}
      <View className="w-full mb-10">
        <Text className="text-4xl font-extrabold text-gray-900">
          Crea una cuenta
        </Text>
        <Text className="text-base text-gray-600 mt-2 text-center">
          y controla tus{" "}
          <Text className="text-primary font-semibold">finanzas</Text>
        </Text>
      </View>

      {/* Formulario */}
      <View className="w-full">
        <RegisterForm />
      </View>

      {/* Enlace de registro */}
      <View className="mt-8">
        <Text className="text-sm text-gray-600 text-center">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/auth/login"
            className="text-primary font-semibold">
            Iniciar Sesión
          </Link>
        </Text>
      </View>
    </View>
  )
}