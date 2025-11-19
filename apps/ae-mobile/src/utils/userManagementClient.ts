import axios, { AxiosInstance } from "axios";
import { USER_MANAGEMENT_API_BASE_URL } from "@src/constants/config";

const userManagementClient: AxiosInstance = axios.create({
  baseURL: USER_MANAGEMENT_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// --------------------------------------------------------
// REQUEST INTERCEPTOR
// --------------------------------------------------------
userManagementClient.interceptors.request.use(
  config => {
    console.log("🔐 AUTH REQUEST:", {
      baseURL: config.baseURL,
      url: config.url,
      method: config.method,
      data: config.data,
    });
    return config;
  },
  error => Promise.reject(error)
);

// --------------------------------------------------------
// RESPONSE INTERCEPTOR
// --------------------------------------------------------
userManagementClient.interceptors.response.use(
  response => {
    console.log("🔐 AUTH RESPONSE:", {
      baseURL: response.config.baseURL,
      url: response.config.url,
      status: response.status,
    });
    return response;
  },
  error => {
    console.error("🔐 AUTH ERROR:", {
      baseURL: error.config?.baseURL,
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export default userManagementClient;
