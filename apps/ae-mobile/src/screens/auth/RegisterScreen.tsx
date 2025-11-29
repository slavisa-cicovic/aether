import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import AppButton from "@src/components/ui/AppButton";
import AppInput from "@src/components/ui/AppInput";
import AppText from "@src/components/ui/AppText";
import { useTheme } from "@src/theme";
import { useAuthStore } from "@src/state/authStore";

export default function RegisterScreen() {
  const router = useRouter();
  const { colors, spacing } = useTheme();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [lang, setLang] = useState("en");
  const [formError, setFormError] = useState<string | null>(null);

  const register = useAuthStore(state => state.register);
  const loading = useAuthStore(state => state.loading);
  const error = useAuthStore(state => state.error);
  const clearError = useAuthStore(state => state.clearError);

  const handleRegister = async () => {
    clearError();
    setFormError(null);

    if (!firstName || !lastName || !email || !password) {
      setFormError("First name, last name, email and password are required.");
      return;
    }

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    try {
      await register({ firstName, lastName, email, password, lang });
      router.replace("/(tabs)");
    } catch (err) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[styles.scrollContent, { padding: spacing.xl }]}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surface, padding: spacing.xl },
          ]}
        >
          <AppText variant="h2" style={styles.title}>
            Create account
          </AppText>
          <AppText variant="bodyMedium" style={styles.subtitle}>
            Join AetherNet with your work email.
          </AppText>

          <View style={{ marginTop: spacing.xl }}>
            <AppInput
              label="First name"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
            />
            <AppInput
              label="Last name"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
            />
            <AppInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            <AppInput
              label="Language (e.g. en, sr-Latn, sr-Cyrl)"
              value={lang}
              onChangeText={setLang}
              autoCapitalize="none"
              placeholder="en"
            />
            <AppInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            <AppInput
              label="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            {(formError || error) && (
              <AppText
                variant="bodySmall"
                style={[styles.error, { color: colors.error }]}
              >
                {formError || error}
              </AppText>
            )}

            <AppButton
              title="Create account"
              onPress={handleRegister}
              loading={loading}
              style={{ marginTop: spacing.lg }}
            />

            <AppButton
              title="Back to login"
              onPress={() => router.replace("/login")}
              variant="outline"
              style={{ marginTop: spacing.md }}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
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
