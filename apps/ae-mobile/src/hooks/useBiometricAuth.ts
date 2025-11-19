import { useCallback, useEffect, useState } from "react";
import * as LocalAuthentication from "expo-local-authentication";

import { authService } from "@src/services/authService";
import { useAuthStore } from "@src/state/authStore";

type AuthTypeLabel = "Face ID" | "Touch ID" | "Biometrics";

const typeLabelMap: Record<LocalAuthentication.AuthenticationType, AuthTypeLabel> =
  {
    [LocalAuthentication.AuthenticationType.FINGERPRINT]: "Touch ID",
    [LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION]: "Face ID",
    [LocalAuthentication.AuthenticationType.IRIS]: "Biometrics",
  };

export function useBiometricAuth() {
  const refreshToken = useAuthStore(state => state.refreshToken);
  const [hasHardware, setHasHardware] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [checking, setChecking] = useState(true);
  const [label, setLabel] = useState<AuthTypeLabel>("Biometrics");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [hardware, enrolled, supportedTypes] = await Promise.all([
          LocalAuthentication.hasHardwareAsync(),
          LocalAuthentication.isEnrolledAsync(),
          LocalAuthentication.supportedAuthenticationTypesAsync(),
        ]);
        setHasHardware(hardware);
        setIsEnrolled(enrolled);
        const type = supportedTypes[0];
        if (type !== undefined && typeLabelMap[type]) {
          setLabel(typeLabelMap[type]);
        }
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const stored = await authService.getRefreshToken();
      setHasSession(Boolean(stored));
    })();
  }, [refreshToken]);

  const canUseBiometrics = hasHardware && isEnrolled && hasSession;

  const loginWithBiometrics = useCallback(async () => {
    if (!canUseBiometrics) {
      throw new Error("Biometric login is not available.");
    }

    setLoading(true);
    try {
      const storedRefresh =
        refreshToken || (await authService.getRefreshToken());
      if (!storedRefresh) {
        throw new Error("No saved session for biometric login.");
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Sign in with ${label}`,
        fallbackLabel: "Use passcode",
      });

      if (!result.success) {
        if (result.error === "user_cancel" || result.error === "app_cancel") {
          throw new Error("Biometric authentication cancelled.");
        }
        throw new Error("Biometric authentication failed.");
      }

      await useAuthStore.getState().loginWithRefreshToken(storedRefresh);
    } finally {
      setLoading(false);
    }
  }, [canUseBiometrics, label, refreshToken]);

  return {
    checking,
    canUseBiometrics,
    label,
    loading,
    loginWithBiometrics,
  };
}
