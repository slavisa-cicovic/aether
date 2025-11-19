import * as SecureStore from "expo-secure-store";

import { LoginCredentials } from "@src/api/types/auth";

const BIOMETRIC_CREDENTIALS_KEY = "auth.biometric.credentials";

export async function saveBiometricCredentials(
  credentials: LoginCredentials
): Promise<void> {
  try {
    await SecureStore.setItemAsync(
      BIOMETRIC_CREDENTIALS_KEY,
      JSON.stringify(credentials)
    );
  } catch (error) {
    console.warn("Failed to save biometric credentials", error);
  }
}

export async function getBiometricCredentials(): Promise<LoginCredentials | null> {
  try {
    const value = await SecureStore.getItemAsync(BIOMETRIC_CREDENTIALS_KEY);
    if (!value) return null;
    return JSON.parse(value) as LoginCredentials;
  } catch (error) {
    console.warn("Failed to read biometric credentials", error);
    return null;
  }
}

export async function hasBiometricCredentials(): Promise<boolean> {
  try {
    const value = await SecureStore.getItemAsync(BIOMETRIC_CREDENTIALS_KEY);
    return Boolean(value);
  } catch (error) {
    console.warn("Failed to check biometric credentials", error);
    return false;
  }
}

export async function clearBiometricCredentials(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(BIOMETRIC_CREDENTIALS_KEY);
  } catch (error) {
    console.warn("Failed to clear biometric credentials", error);
  }
}
