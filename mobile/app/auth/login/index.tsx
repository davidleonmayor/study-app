import { LoginForm } from "@/presentation";
import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";


export default function LoginScreen() {

  return (
    <View className="flex-1 items-center justify-center px-6 bg-white">
      {/* Encabezado */}
      <View className="w-full mb-10">
        <Text className="text-4xl font-extrabold text-gray-900">
          Inicia sesión
        </Text>
        <Text className="text-base text-gray-600 mt-2 text-center">
          y controla tus{" "}
          <Text className="text-primary font-semibold">finanzas</Text>
        </Text>
      </View>

      {/* Formulario */}
      <View className="w-full">
        <LoginForm />
      </View>

      {/* Enlace de registro */}
      <View className="mt-8">
        <Text className="text-sm text-gray-600 text-center">
          ¿No tienes una cuenta?{" "}
          <Link
            href="/auth/register"
            className="text-primary font-semibold">
            Regístrate aquí
          </Link>
        </Text>
      </View>
    </View>
  );
}
