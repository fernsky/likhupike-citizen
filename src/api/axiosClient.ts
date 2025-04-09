import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { getAuthToken, setAuthToken, removeAuthToken } from "@/lib/auth-utils";
import { authConfig } from "@/config/middleware-config";

// Create API instance with default config
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken(); // Use our auth utility instead of direct localStorage access
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Any status code within the range of 2xx triggers this function
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized errors (token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
          // No refresh token available, redirect to login
          handleAuthRedirect();
          return Promise.reject(error);
        }

        // Call refresh token endpoint
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/citizen-auth/refresh`, // Updated endpoint to match authApi
          {},
          {
            headers: {
              "Content-Type": "application/json",
              "X-Refresh-Token": refreshToken,
            },
          }
        );

        if (response.data.data?.accessToken) {
          const tokenData = response.data.data;

          // Use our utility to store tokens in both localStorage and cookies
          setAuthToken(tokenData.accessToken, tokenData.expiresIn);
          localStorage.setItem("refresh_token", tokenData.refreshToken);
          localStorage.setItem(
            "token_expiry",
            String(Date.now() + tokenData.expiresIn * 1000)
          );

          // Update authorization header and retry original request
          api.defaults.headers.common["Authorization"] =
            `Bearer ${tokenData.accessToken}`;

          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed, redirect to login
        removeAuthToken(); // Use our utility to clear tokens from both localStorage and cookies
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("token_expiry");

        handleAuthRedirect();
        return Promise.reject(refreshError);
      }
    }

    // For 403 Forbidden responses, redirect to unauthorized page
    if (error.response?.status === 403) {
      const locale = getLocale();
      window.location.href = `/${locale}/unauthorized`;
    }

    // For 503 Service Unavailable, show maintenance page
    if (error.response?.status === 503) {
      const locale = getLocale();
      window.location.href = `/${locale}/maintenance`;
    }

    return Promise.reject(error);
  }
);

// Helper function to handle authentication redirects with locale
function handleAuthRedirect() {
  const locale = getLocale();
  const returnUrl = encodeURIComponent(window.location.pathname);
  window.location.href = `/${locale}${authConfig.loginRedirectPath}?returnUrl=${returnUrl}`;
}

// Helper to get the current locale from URL or default to 'en'
function getLocale(): string {
  if (typeof window !== "undefined") {
    const pathParts = window.location.pathname.split("/");
    // The locale should be the first part after the leading slash
    if (pathParts.length > 1) {
      return pathParts[1] || "en";
    }
  }
  return "en";
}

export default api;
