import { Text } from "react-native";

interface ErrorMessageProps {
    errorText?: string;
}

export const ErrorMessage = ({ errorText = '' }: ErrorMessageProps) => {
    return (
        <Text
        className="text-red-500 text-center text-xs"
        >
            {errorText}
        </Text>
    );
}