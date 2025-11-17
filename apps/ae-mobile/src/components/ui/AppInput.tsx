import React from "react";
import { TextInput, View } from "react-native";
import AppText from "./AppText";
import { useTheme } from "@src/theme";
import { scale } from "react-native-size-matters";

interface AppInputProps {
    label: string;
    value: string;
    onChangeText: (v: string) => void;
}

export default function AppInput({ label, value, onChangeText }: AppInputProps) {
    const { colors, spacing } = useTheme();

    return (
        <View style={{ marginBottom: spacing.md }}>
            <AppText variant="bodyMedium" style={{ marginBottom: 4 }}>
                {label}
            </AppText>

            <TextInput
                value={value}
                onChangeText={onChangeText}
                style={{
                    padding: spacing.md,
                    borderWidth: 1,
                    borderRadius: scale(6),
                    borderColor: colors.border,
                    backgroundColor: colors.surface,
                    color: colors.text,
                }}
            />
        </View>
    );
}
