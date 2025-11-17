import React from "react";
import { Text, TextProps, TextStyle } from "react-native";
import { TypographyVariant } from "@src/theme/typography";
import { useTheme } from "@src/theme";

interface AppTextProps extends TextProps {
    variant?: TypographyVariant;
    color?: string;
}

export default function AppText({
    variant = "body",
    color,
    style,
    children,
    ...rest
}: AppTextProps) {
    const { typography, colors } = useTheme();

    const variantStyle: TextStyle = {
        ...typography[variant],
        color: color ?? colors.text,
    };

    return (
        <Text style={[variantStyle, style]} {...rest}>
            {children}
        </Text>
    );
}
