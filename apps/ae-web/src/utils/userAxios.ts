import axios, { AxiosRequestConfig } from "axios";
// config

// ----------------------------------------------------------------------

const USER_MGMT_BASE_URL =
  process.env.NEXT_PUBLIC_USER_MGMT_BASE_URL ||
  process.env.USER_MGMT_BASE_URL?.replace(/\/api\/auth\/login$/, "") ||
  "http://localhost:8082";

const TOKEN_STORAGE_KEY = "ae-auth-token";
let authToken: string | null = null;

const userAxiosInstance = axios.create({
  baseURL: USER_MGMT_BASE_URL,
});

export const setUserAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    userAxiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete userAxiosInstance.defaults.headers.common.Authorization;
  }
};

userAxiosInstance.interceptors.response.use(
  res => res,
  error =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    )
);

userAxiosInstance.interceptors.request.use(config => {
  if (!authToken && typeof window !== "undefined") {
    const stored = sessionStorage.getItem(TOKEN_STORAGE_KEY);
    if (stored) {
      authToken = stored;
    }
  }
  if (authToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export default userAxiosInstance;

export const userGetFetcher = async (
  args: string | [string, AxiosRequestConfig]
) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await userAxiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------
export const endpoints = {
  user: {
    list: "/api/users",
    details: "/api/user/details",
    detail: (id: number | string) => `/api/users/${id}`,
    resendInvite: (id: number | string) => `/api/users/${id}/resend-invite`,
  },
};
