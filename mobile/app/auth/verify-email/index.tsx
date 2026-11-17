import {
  ErrorMessage,
  InputControl,
  VerificationCodeInput,
  useAuthStore,
} from "@/presentation";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import { useForm } from "react-hook-form";

const CREATE_BUDGET_ROUTE =
  "/(money-up-app)/(drawer)/(stack)/create-budget-form";

interface VerificationForm {
  email: string;
}

export default function VerifyEmailScreen() {
  const verifyEmail = useAuthStore((state) => state.verifyEmail);
  const {
    control,
    formState: { errors },
    watch,
  } = useForm<VerificationForm>({
    defaultValues: { email: "" },
  });
  const email = watch("email").trim().toLowerCase();
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerification = async (otp: string) => {
    if (!email || !/\S+@\S+\.\S+/.test(email) || isVerifying) {
      Alert.alert("Correo inválido", "Introduce un correo válido primero.");
      return;
    }

    setIsVerifying(true);

    try {
      await verifyEmail(email, otp);
      router.replace(CREATE_BUDGET_ROUTE);
    } catch (error) {
      setCode("");
      Alert.alert(
        "Código inválido",
        error instanceof Error
          ? error.message
          : "No se pudo verificar el correo.",
      );
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <View className="w-full items-center px-6">
      <Text className="mb-2 text-3xl font-extrabold text-gray-900">
        Verifica tu correo
      </Text>
      <Text className="mb-8 text-center text-gray-600">
        Introduce tu correo y el código de 6 dígitos enviado por InsForge.
      </Text>

      <InputControl
        name="email"
        control={control}
        keyboardType="email-address"
        placeholder="correo@ejemplo.com"
        error={errors.email}
        rules={{
          required: "El correo es obligatorio",
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: "Correo inválido",
          },
        }}
      />
      {errors.email && <ErrorMessage errorText={errors.email.message} />}

      <VerificationCodeInput
        value={code}
        onChangeText={setCode}
        onComplete={(otp) => void handleVerification(otp)}
        disabled={isVerifying}
      />

      {isVerifying && (
        <Text className="mt-4 text-gray-600">Verificando código...</Text>
      )}
    </View>
  );
}
