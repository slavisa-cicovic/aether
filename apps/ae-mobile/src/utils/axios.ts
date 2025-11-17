import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import Constants from "expo-constants";
import { camelToSnake, snakeToCamel } from "./transformers";

function resolveBaseUrl(): string {
  const debuggerHost =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoGo?.developer?.hostUri;

  if (debuggerHost) {
    // Example: "192.168.10.148:8081" → take only IP
    const host = debuggerHost.split(":")[0];
    return `http://${host}:8080`;
  }

  // Fallback for production build (no Expo dev server)
  return "https://app.aethernet.com";
}

const baseURL = resolveBaseUrl();

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
});

// ----- Request / Response logging -----

axiosInstance.interceptors.request.use(
  config => {
    console.log("🔍 AXIOS REQUEST:", {
      url: config.url,
      method: config.method,
      baseURL: config.baseURL,
      params: config.params,
      data: config.data,
      headers: config.headers,
    });
    return config;
  },
  error => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  response => {
    console.log("✅ AXIOS RESPONSE:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  error => {
    console.error("❌ AXIOS ERROR:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

// ----- Auto camel ↔ snake transform -----

// request: camelCase (frontend) → snake_case (backend)
const origTransformRequest = axiosInstance.defaults.transformRequest ?? [];
axiosInstance.defaults.transformRequest = [
  (data: any, headers: any) => {
    if (data == null) return data;
    return camelToSnake(data);
  },
  ...(Array.isArray(origTransformRequest)
    ? origTransformRequest
    : [origTransformRequest]),
];

// response: snake_case (backend) → camelCase (frontend)
const origTransformResponse = axiosInstance.defaults.transformResponse ?? [];
axiosInstance.defaults.transformResponse = [
  ...(Array.isArray(origTransformResponse)
    ? origTransformResponse
    : [origTransformResponse]),
  (data: any) => {
    if (data == null) return data;
    return snakeToCamel(data);
  },
];

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async <T = any>(
  args: string | [string, AxiosRequestConfig]
): Promise<T> => {
  const [url, config] = Array.isArray(args) ? args : [args, {}];

  const res = await axiosInstance({
    url,
    method: config?.method || "GET",
    data: config?.data,
    params: config?.params,
    headers: config?.headers,
  });

  return res.data as T;
};

export const postFetcher = async <T = any>(
  url: string,
  data: any,
  options?: {
    urlParams?: Record<string, string>;
    authToken?: string;
  }
): Promise<T> => {
  // Replace URL placeholders
  let finalUrl = url;
  if (options?.urlParams) {
    finalUrl = Object.entries(options.urlParams).reduce(
      (u, [key, value]) => u.replace(`{${key}}`, value),
      finalUrl
    );
  }

  const transactionId = `txn-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;
  const authToken = options?.authToken || "dummy-voice-agent-token";

  console.log(`🚀 POST ${finalUrl}`, { data, urlParams: options?.urlParams });

  const res = await axiosInstance.post(finalUrl, data, {
    headers: {
      "X-Transaction-ID": transactionId,
      Authorization: `Bearer ${authToken}`,
    },
  });

  return res.data as T;
};
