import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

import { authService } from "@src/services/authService";
import { VOICE_GATEWAY_API_BASE_URL } from "@src/constants/config";
import { camelToSnake, snakeToCamel } from "./transformers";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: VOICE_GATEWAY_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
});

// ----- Request / Response logging -----

axiosInstance.interceptors.request.use(
  async config => {
    const token = await authService.getToken();
    if (token) {
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      };
    }

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

  const transactionId = `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const authToken = options?.authToken;
  console.log(`🚀 POST ${finalUrl}`, { data, urlParams: options?.urlParams });

  const res = await axiosInstance.post(finalUrl, data, {
    headers: {
      "X-Transaction-ID": transactionId,
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    },
  });

  return res.data as T;
};
