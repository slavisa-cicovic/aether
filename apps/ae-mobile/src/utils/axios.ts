import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import Constants from "expo-constants";
import { camelToSnake, snakeToCamel } from "./transformers";

function resolveBaseUrl(): string {
  const debuggerHost =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoGo?.developer?.hostUri;
  if (debuggerHost) {
    // Primer: "192.168.10.148:8081" → uzmi samo IP
    const host = debuggerHost.split(":")[0];
    return `http://${host}:8080`;
  }

  // Fallback za production build (nema Expo dev servera)
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

// Request interceptor
axiosInstance.interceptors.request.use(
  config => {
    console.log('🔍 AXIOS REQUEST DETAILS:', {
      method: config.method,
      data: config.data,
      headers: JSON.stringify(config.headers),
      hasData: !!config.data,
      dataType: typeof config.data,
      dataKeys: config.data ? Object.keys(config.data) : 'no data'
    });
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ AXIOS RESPONSE:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ AXIOS ERROR DETAILS:', {
      url: error.config?.url,
      method: error.config?.method,
      data: error.config?.data,
      headers: error.config?.headers,
      status: error.response?.status,
      responseData: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance({
    url,
    method: config?.method || 'GET',
    data: config?.data,
    params: config?.params,
    headers: config?.headers,
  });
  console.log("Response Data:", res.data);
  return res.data;
};

export const postFetcher = async <T>(
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
      (url, [key, value]) => url.replace(`{${key}}`, value),
      url
    );
  }

  // Generate transaction ID and get auth token
  const transactionId = `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const authToken = options?.authToken || "dummy-voice-agent-token";

  console.log(`🚀 POST ${finalUrl}`, { data, urlParams: options?.urlParams });

  const response = await fetcher([finalUrl, {
    method: 'POST',
    data: camelToSnake(data),
    headers: {
      'Content-Type': 'application/json',
      'X-Transaction-ID': transactionId,
      'Authorization': `Bearer ${authToken}`,
    },
  }]);

  return snakeToCamel(response) as T;
};