import { ErrorMessage } from "@/presentation/components/ErrorMessage";
import { router } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { Pressable, Text, View } from "react-native";
import { InputControl } from "../../components/InputControl";
import { PasswordInput } from "../../components/PasswordInput";
import { useAuthStore } from "../store/useAuthStore";


interface LoginForm {
    email: string;
    password: string;
}

export const LoginForm = () => {

    const login = useAuthStore(state => state.login);



    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: 'sebas@test.com',
            password: '12345678',
        }
    });


    const handleLogin = async (data: LoginForm) => {
        try {
            const { email, password } = data;
            await login(email, password);
            router.replace("/(money-up-app)/(drawer)/(stack)/(tabs)/budgets");
        } catch (error) {
            console.log(error)
        }
    }

    return (


        <View className="w-[250px]">

            <Text className="text-gray-700 font-bold text-[16px] mb-1">Email</Text>
            <InputControl
                name="email"
                keyboardType="email-address"
                control={control}
                error={errors.email}
                placeholder="examaple@hotmail.com"
                rules={{
                    required: "Ingresa tu correo electronico"
                }}
            />
            {errors.email && <ErrorMessage errorText={errors.email.message} />}

            <Text className="text-gray-700mb-1 font-bold text-[16px]">Contraseña</Text>
            <PasswordInput
                name="password"
                rules={{
                    required: "Ingresa tu contraseña"
                }}
                error={errors.password}
                control={control}
            />
            {errors.password && <ErrorMessage errorText={errors.password.message} />}

            <Pressable
                onPress={handleSubmit(handleLogin)}
                className="bg-primary mt-2 active:bg-primaryDark rounded-lg p-3">
                <Text className="text-center text-wh">Iniciar Sesión</Text>
            </Pressable>
        </View>

    );
}
