import React from "react";
import {
  Alert,
  Pressable,
  Text,
  View
} from "react-native";

import { authService } from "@/core";
import { ErrorMessage } from "@/presentation/components/ErrorMessage";
import { router } from "expo-router";
import { useForm } from 'react-hook-form';
import { InputControl } from "../../components/InputControl";


interface RegisterForm {
    email: string;
    password: string;
    username: string;
    confirmPassword: string;
}

export const RegisterForm = () => {

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm({
        defaultValues: {
            email: 'sebas@test.com',
            password: '123456789',
            confirmPassword: '123456789',
            username: 'sebas'
        }
    });

    const handleRegister = async (data: RegisterForm) => {
        const { email, password, username: name } = data;

        try {
            const result = await authService.register(email, name, password);

            Alert.alert(
                "Cuenta creada",
                result.requiresEmailVerification
                    ? "Revisa tu correo para verificar la cuenta antes de iniciar sesión."
                    : "Ya puedes iniciar sesión.",
                [{
                    text: "Continuar",
                    onPress: () => router.replace(
                        result.requiresEmailVerification
                            ? {
                                pathname: "/auth/verify-email",
                                params: { email: email.trim().toLowerCase() },
                            }
                            : "/auth/login",
                    ),
                }],
            );
        } catch (error) {
            Alert.alert(
                "No se pudo crear la cuenta",
                error instanceof Error ? error.message : "Inténtalo nuevamente.",
            );
        }
    }

    const password = watch('password');

    return (


        <View className="w-[250px]">
            <Text className="text-gray-700 font-bold text-[16px] mb-1">Email</Text>

            <InputControl
                name="email"
                control={control}
                keyboardType="email-address"
                placeholder="El email es obligatorio"
                error={errors.email}
                rules={{
                    required: "El email es obligatorio",
                    pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Correo inválido",
                    },
                }}
            />

            {errors.email && <ErrorMessage errorText={errors.email.message} />}


            <Text className="text-gray-700 font-bold text-[16px] mb-1">
                Nombre de Usuario
            </Text>

            <InputControl
                name="username"
                control={control}
                keyboardType="default"
                placeholder="Jhon Doe"
                error={errors.username}
                rules={{
                    required: "El nombre de usuario es obligatorio"
                }}
            />
            {errors.username && <ErrorMessage errorText={errors.username.message} />}


            <Text className="text-gray-700mb-1 font-bold text-[16px]">Contraseña</Text>

            <InputControl
                name="password"
                secureTextEntry
                control={control}
                error={errors.password}

                rules={{
                    required: 'La contraseña es obligatoria',
                    minLength: {
                        message: 'La contraseña debe tener mínimo 6 caracteres',
                        value: 8
                    }
                }}
            />
            {errors.password && <ErrorMessage errorText={errors.password.message} />}

            <Text className="text-gray-700mb-1 font-bold text-[16px]">Repetir Contraseña</Text>
            <InputControl
                name="confirmPassword"
                control={control}
                secureTextEntry
                placeholder="Repite tu contraseña"
                error={errors.confirmPassword}
                rules={{
                    required: "Debes repetir tu contraseña",
                    validate: (value) => value === password || "Las contraseñas no coinciden"
                }}
            />

            <ErrorMessage errorText={errors.confirmPassword?.message} />

            <Pressable
                className="bg-primary active:bg-primaryDark rounded-lg p-3"
                onPress={handleSubmit(handleRegister)}>
                <Text className="text-center text-wh">Crear Cuenta</Text>
            </Pressable>
        </View>

    );
}
