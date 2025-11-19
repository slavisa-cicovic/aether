import Constants from "expo-constants";

const getDebuggerHost = (): string | undefined =>
  Constants.expoConfig?.hostUri ||
  Constants.manifest2?.extra?.expoGo?.developer?.hostUri;

const resolveServiceBaseUrl = (port: number, fallback: string): string => {
  const debuggerHost = getDebuggerHost();
  if (debuggerHost) {
    const host = debuggerHost.split(":")[0];
    return `http://${host}:${port}`;
  }
  return fallback;
};

export const VOICE_GATEWAY_API_BASE_URL = resolveServiceBaseUrl(
  8080,
  "https://app.aethernet.com"
);

export const USER_MANAGEMENT_API_BASE_URL = resolveServiceBaseUrl(
  8082,
  "https://users.aethernet.com"
);
