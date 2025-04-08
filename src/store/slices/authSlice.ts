import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CitizenAuthResponse } from "@/domains/auth/types";
import { isClient } from "@/lib/utils";
import { setAuthToken, removeAuthToken } from "@/lib/auth-utils";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  citizenId: string | null;
  expiresAt: number | null;
  loading: boolean;
  error: string | null;
}

// Initialize state from local storage if available
const initialState: AuthState = {
  isAuthenticated: isClient && !!localStorage.getItem("auth_token"),
  token: isClient ? localStorage.getItem("auth_token") : null,
  refreshToken: isClient ? localStorage.getItem("refresh_token") : null,
  citizenId: isClient ? localStorage.getItem("user_id") : null,
  expiresAt: isClient
    ? Number(localStorage.getItem("token_expiry") || "0")
    : null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action: PayloadAction<CitizenAuthResponse>) {
      state.isAuthenticated = true;
      state.token = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.citizenId = action.payload.citizenId;
      state.expiresAt = Date.now() + action.payload.expiresIn * 1000;
      state.loading = false;
      state.error = null;

      // Store in localStorage and cookies using our utility
      if (isClient) {
        setAuthToken(action.payload.accessToken, action.payload.expiresIn);
        localStorage.setItem("refresh_token", action.payload.refreshToken);
        localStorage.setItem("user_id", action.payload.citizenId);
        localStorage.setItem(
          "token_expiry",
          String(Date.now() + action.payload.expiresIn * 1000)
        );
      }
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    refreshTokenSuccess(state, action: PayloadAction<CitizenAuthResponse>) {
      state.token = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.expiresAt = Date.now() + action.payload.expiresIn * 1000;

      // Update localStorage and cookies
      if (isClient) {
        setAuthToken(action.payload.accessToken, action.payload.expiresIn);
        localStorage.setItem("refresh_token", action.payload.refreshToken);
        localStorage.setItem(
          "token_expiry",
          String(Date.now() + action.payload.expiresIn * 1000)
        );
      }
    },
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
      state.citizenId = null;
      state.expiresAt = null;

      // Clear localStorage and cookies
      if (isClient) {
        removeAuthToken();
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user_id");
        localStorage.removeItem("token_expiry");
      }
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  refreshTokenSuccess,
  logout,
  clearAuthError,
} = authSlice.actions;

export const authReducer = authSlice.reducer;
