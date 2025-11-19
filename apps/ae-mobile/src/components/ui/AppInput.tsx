import React from "react";
import { TextInput, TextInputProps, View } from "react-native";
import { scale } from "react-native-size-matters";

import AppText from "./AppText";
import { useTheme } from "@src/theme";

interface AppInputProps extends Pick<TextInputProps, "keyboardType" | "secureTextEntry" | "autoCapitalize" | "autoComplete" | "textContentType" | "placeholder"> {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
}

export default function AppInput({
  label,
  value,
  onChangeText,
  keyboardType,
  secureTextEntry,
  autoCapitalize,
  autoComplete,
  textContentType,
  placeholder,
}: AppInputProps) {
  const { colors, spacing } = useTheme();

  return (
    <View style={{ marginBottom: spacing.md }}>
      <AppText variant="bodyMedium" style={{ marginBottom: 4 }}>
        {label}
      </AppText>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        textContentType={textContentType}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
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
