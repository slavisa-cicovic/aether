import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  View,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

import AppButton from "@src/components/ui/AppButton";
import AppInput from "@src/components/ui/AppInput";
import AppText from "@src/components/ui/AppText";
import { useTheme } from "@src/theme";
import { useAuthStore } from "@src/state/authStore";

export default function LoginScreen() {
  const router = useRouter();
  const { colors, spacing } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const login = useAuthStore(state => state.login);
  const loading = useAuthStore(state => state.loading);
  const error = useAuthStore(state => state.error);
  const clearError = useAuthStore(state => state.clearError);

  const handleLogin = async () => {
    clearError();
    setFormError(null);

    if (!email || !password) {
      setFormError("Email and password are required.");
      return;
    }

    try {
      await login({ email, password });
      router.replace("/(tabs)");
    } catch (err) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError("Login failed. Please try again.");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: "padding", android: undefined })}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.card, { backgroundColor: colors.surface, padding: spacing.xl }]}>
        <AppText variant="h2" style={styles.title}>
          Welcome back
        </AppText>
        <AppText variant="bodyMedium" style={styles.subtitle}>
          Sign in to continue to AetherNet
        </AppText>

        <View style={{ marginTop: spacing.xl }}>
          <AppInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <AppInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          {(formError || error) && (
            <AppText variant="bodySmall" style={[styles.error, { color: colors.error }]}>
              {formError || error}
            </AppText>
          )}

          <AppButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            style={{ marginTop: spacing.lg }}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  card: {
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
    color: "#6B7280",
  },
  error: {
    marginTop: 8,
  },
});
