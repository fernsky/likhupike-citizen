import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  ApiResponse,
  CitizenAuthResponse,
  CitizenChangePasswordRequest,
  CitizenLoginRequest,
  CitizenRequestPasswordResetRequest,
  CitizenResetPasswordRequest,
} from "@/domains/auth/types";

/**
 * RTK Query API for authentication endpoints.
 * Implements all endpoints from CitizenAuthController.
 */
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL || ""}/api/v1/citizen-auth`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("auth_token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    // Login endpoint
    login: builder.mutation<CitizenAuthResponse, CitizenLoginRequest>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: ApiResponse<CitizenAuthResponse>) => {
        // Store tokens in localStorage upon successful login
        if (response.success && response.data) {
          localStorage.setItem("auth_token", response.data.accessToken);
          localStorage.setItem("refresh_token", response.data.refreshToken);
          localStorage.setItem("user_id", response.data.citizenId);
        }
        return response.data;
      },
      invalidatesTags: ["Auth"],
    }),

    // Refresh token endpoint
    refreshToken: builder.mutation<CitizenAuthResponse, string>({
      query: (refreshToken) => ({
        url: "/refresh",
        method: "POST",
        headers: {
          "X-Refresh-Token": refreshToken,
        },
      }),
      transformResponse: (response: ApiResponse<CitizenAuthResponse>) => {
        // Update stored tokens
        if (response.success && response.data) {
          localStorage.setItem("auth_token", response.data.accessToken);
          localStorage.setItem("refresh_token", response.data.refreshToken);
          localStorage.setItem("user_id", response.data.citizenId);
        }
        return response.data;
      },
    }),

    // Logout endpoint
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      // No need to transform response, but we clear localStorage
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
          localStorage.removeItem("auth_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user_id");
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
      invalidatesTags: ["Auth"],
    }),

    // Request password reset OTP
    requestPasswordReset: builder.mutation<
      void,
      CitizenRequestPasswordResetRequest
    >({
      query: (data) => ({
        url: "/password-reset/request",
        method: "POST",
        body: data,
      }),
    }),

    // Reset password with OTP
    resetPassword: builder.mutation<void, CitizenResetPasswordRequest>({
      query: (data) => ({
        url: "/password-reset/reset",
        method: "POST",
        body: data,
      }),
    }),

    // Change password (authenticated user)
    changePassword: builder.mutation<void, CitizenChangePasswordRequest>({
      query: (data) => ({
        url: "/change-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
} = authApi;
