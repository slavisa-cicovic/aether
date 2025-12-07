import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { isAxiosError } from "axios";

import AppButton from "@src/components/ui/AppButton";
import AppInput from "@src/components/ui/AppInput";
import AppText from "@src/components/ui/AppText";
import { authService } from "@src/services/authService";
import { useTheme } from "@src/theme";

type Step = "request" | "reset";

export default function ForgotPasswordScreen() {
  const { colors, spacing } = useTheme();
  const router = useRouter();
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleRequestReset = async () => {
    setError(null);
    setInfo(null);

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      const response = await authService.requestPasswordReset({ email });
      setInfo(response.message || "If the account exists, we sent you a reset link.");
      if (response.resetToken) {
        setToken(response.resetToken);
      }
      setStep("reset");
    } catch (err) {
      setError(extractMessage(err) ?? "Unable to start password reset.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError(null);
    setInfo(null);

    if (!email || !token || !newPassword) {
      setError("Email, token and new password are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await authService.resetPassword({ email, token, newPassword });
      setInfo("Password updated. Please sign in with your new credentials.");
      router.replace("/login");
    } catch (err) {
      setError(extractMessage(err) ?? "Failed to reset password.");
    } finally {
      setLoading(false);
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
            Forgot password
          </AppText>
          <AppText variant="bodyMedium" style={styles.subtitle}>
            We&apos;ll help you reset it in two quick steps.
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

            {step === "reset" && (
              <>
                <AppInput
                  label="Reset token"
                  value={token}
                  onChangeText={setToken}
                  autoCapitalize="none"
                />
                <AppText variant="caption" style={{ color: colors.textSecondary, marginBottom: spacing.sm }}>
                  Check your email for the code. In dev builds it appears below.
                </AppText>
                <AppInput
                  label="New password"
                  value={newPassword}
                  onChangeText={setNewPassword}
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
              </>
            )}

            {error && (
              <AppText
                variant="bodySmall"
                style={[styles.error, { color: colors.error }]}
              >
                {error}
              </AppText>
            )}

            {info && (
              <AppText
                variant="bodySmall"
                style={[styles.info, { color: colors.textSecondary }]}
              >
                {info}
              </AppText>
            )}

            <AppButton
              title={step === "request" ? "Send reset link" : "Update password"}
              onPress={step === "request" ? handleRequestReset : handleResetPassword}
              loading={loading}
              style={{ marginTop: spacing.lg }}
            />

            <AppButton
              title="Back to login"
              variant="outline"
              onPress={() => router.replace("/login")}
              style={{ marginTop: spacing.md }}
            />

            {step === "reset" && token && (
              <View style={{ marginTop: spacing.md }}>
                <AppText variant="caption" style={{ color: colors.textSecondary }}>
                  Dev token: {token}
                </AppText>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function extractMessage(error: unknown): string | undefined {
  if (isAxiosError(error)) {
    const data = error.response?.data as Record<string, unknown> | undefined;
    const fromBody =
      (typeof data?.message === "string" && data.message) ||
      (typeof data?.error === "string" && data.error) ||
      (typeof data?.detail === "string" && data.detail);
    return fromBody || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return undefined;
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
  info: {
    marginTop: 8,
  },
});
