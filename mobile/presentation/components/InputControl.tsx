import { Control, Controller, ControllerProps, FieldError, FieldValues } from "react-hook-form";
import { TextInput, TextInputProps } from "react-native";

type InputControlProps<T extends FieldValues = FieldValues> =
    Omit<TextInputProps, "onChange" | "value"> &
    Omit<ControllerProps<T>, "render" | "control"> & {
        error?: FieldError | undefined;
        control: Control<any>
    };

export const InputControl = ({
    control,
    error,
    name,
    keyboardType,
    placeholder = '',
    rules,
    secureTextEntry,
    className = ''

}: InputControlProps) => {

    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    placeholder={placeholder}
                    autoCapitalize="none"
                    placeholderTextColor="#9ca3af"
                    className={`border rounded-lg px-3 py-4 mb-1 text-gray-700 ${error ? "border-red-500" : "border-gray-300"} ${className}`}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                />
            )}
        />
    );
}