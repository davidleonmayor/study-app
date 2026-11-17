import AntDesign from "@expo/vector-icons/AntDesign";
import { useState } from "react";
import { Control, Controller, ControllerProps, FieldError, FieldValues } from "react-hook-form";
import { Pressable, TextInput, TextInputProps, View } from "react-native";


type PasswordInputProps<T extends FieldValues = FieldValues> =
  Omit<TextInputProps, "onChange" | "value"> &
  Omit<ControllerProps<T>, "render" | "control"> & {
    error?: FieldError | undefined;
    control: Control<any>
  };

export const PasswordInput = ({
  control,
  error,
  name,
  rules,
  placeholder = 'Ingresa tu contraseña' }: PasswordInputProps) => {

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const showPassword = () => {
    setIsPasswordVisible(!isPasswordVisible);
  }

  return (

    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value, onBlur } }) => (
        <View className="">
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            secureTextEntry={!isPasswordVisible}
            placeholder={placeholder}
            className={`border rounded-lg px-3 py-4 mb-1 text-gray-700 ${error ? "border-red-500" : "border-gray-300"}`}
            placeholderTextColor="#9ca3af"
          />

          <Pressable
            onPress={showPassword}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <AntDesign
              size={22}
              name={isPasswordVisible ? "eye-invisible" : "eye"}
              color="#555"
            />
          </Pressable>
        </View>
      )}
    />

  );
};
