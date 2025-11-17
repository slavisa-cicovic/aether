// src/components/ui/AppButton.tsx
import { useTheme } from "@src/theme";
import React from "react";
import {
    ActivityIndicator,
    Pressable,
    TextStyle
} from "react-native";
import { scale } from "react-native-size-matters";
import AppText from "./AppText";

type ButtonVariant = "primary" | "outline" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

interface AppButtonProps {
    title: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    fullWidth?: boolean;
    style?: any;
}

export default function AppButton({
    title,
    onPress,
    variant = "primary",
    size = "md",
    disabled = false,
    loading = false,
    fullWidth = true,
    style,
}: AppButtonProps) {
    const { colors, spacing, typography } = useTheme();

    // SIZE PRESETS
    const height = {
        sm: scale(32),
        md: scale(44),
        lg: scale(54),
    }[size];

    const paddingHorizontal = {
        sm: spacing.md,
        md: spacing.lg,
        lg: spacing.xl,
    }[size];

    // COLORS PER VARIANT
    const backgroundColor = (() => {
        if (disabled) return colors.border;
        switch (variant) {
            case "primary":
                return colors.primary;
            case "destructive":
                return colors.error;
            case "outline":
                return "transparent";
        }
    })();

    const borderColor = (() => {
        if (disabled) return colors.border;
        switch (variant) {
            case "primary":
                return colors.primary;
            case "destructive":
                return colors.error;
            case "outline":
                return colors.text;
        }
    })();

    const textColor = (() => {
        if (variant === "outline") return colors.text;
        return "white";
    })();

    // TEXT STYLE
    const textStyle: TextStyle = {
        ...typography.bodyBold,
        fontSize: scale(16),
        color: disabled ? colors.textSecondary : textColor,
    };

    return (
        <Pressable
            onPress={disabled || loading ? undefined : onPress}
            android_ripple={
                disabled || loading
                    ? undefined
                    : { color: variant === "outline" ? colors.border : "#ffffff40" }
            }
            style={[
                {
                    height,
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "row",
                    paddingHorizontal,
                    borderRadius: scale(8),
                    borderWidth: variant === "outline" ? 1 : 0,
                    borderColor,
                    backgroundColor,
                    width: fullWidth ? "100%" : undefined,
                    opacity: disabled ? 0.6 : 1,
                },
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={textColor} />
            ) : (
                <AppText variant="bodyBold" style={textStyle}>
                    {title}
                </AppText>
            )}
        </Pressable>
    );
}
