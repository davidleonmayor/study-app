import React from "react";
import { TextInput } from "react-native";

interface VerificationCodeInputProps {
  value: string;
  onChangeText: (value: string) => void;
  onComplete: (value: string) => void;
  disabled?: boolean;
}

export const VerificationCodeInput = ({
  value,
  onChangeText,
  onComplete,
  disabled = false,
}: VerificationCodeInputProps) => {
  const handleChange = (input: string) => {
    const code = input.replace(/\D/g, "").slice(0, 6);

    onChangeText(code);

    if (code.length === 6) {
      onComplete(code);
    }
  };

  return (
    <TextInput
      value={value}
      onChangeText={handleChange}
      keyboardType="number-pad"
      maxLength={6}
      editable={!disabled}
      autoFocus
      textContentType="oneTimeCode"
      className="w-full rounded-lg border border-gray-300 px-3 py-4 text-center text-2xl tracking-[8px] text-gray-700"
      placeholder="668768"
      placeholderTextColor="#9ca3af"
    />
  );
};
