import { useCallback, useEffect, useState } from "react";
import * as LocalAuthentication from "expo-local-authentication";

import { useAuthStore } from "@src/state/authStore";
import {
  getBiometricCredentials,
  hasBiometricCredentials,
} from "@src/utils/biometricStorage";

type AuthTypeLabel = "Face ID" | "Touch ID" | "Biometrics";

const typeLabelMap: Record<
  LocalAuthentication.AuthenticationType,
  AuthTypeLabel
> = {
  [LocalAuthentication.AuthenticationType.FINGERPRINT]: "Touch ID",
  [LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION]: "Face ID",
  [LocalAuthentication.AuthenticationType.IRIS]: "Biometrics",
};

export function useBiometricAuth() {
  const biometricVersion = useAuthStore(
    state => state.biometricCredentialVersion
  );
  const [hasHardware, setHasHardware] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [hasCredentials, setHasCredentials] = useState(false);
  const [checking, setChecking] = useState(true);
  const [label, setLabel] = useState<AuthTypeLabel>("Biometrics");

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
    let active = true;
    (async () => {
      const exists = await hasBiometricCredentials();
      if (active) {
        setHasCredentials(exists);
      }
    })();
    return () => {
      active = false;
    };
  }, [biometricVersion]);

  const canUseBiometrics = hasHardware && isEnrolled && hasCredentials;

  const loginWithBiometrics = useCallback(async () => {
    if (!canUseBiometrics) {
      throw new Error("Biometric login is not available.");
    }

    const credentials = await getBiometricCredentials();
    if (!credentials) {
      throw new Error("Biometric credentials are missing.");
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

    await useAuthStore.getState().login(credentials);
  }, [canUseBiometrics, label]);

  return {
    checking,
    canUseBiometrics,
    label,
    loginWithBiometrics,
  };
}
