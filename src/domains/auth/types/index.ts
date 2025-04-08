/**
 * Type definitions for authentication domain
 * Maps directly to backend API DTOs from CitizenAuthController
 */

export interface CitizenLoginRequest {
  email: string;
  password: string;
}

export interface CitizenAuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  citizenId: string;
}

export interface CitizenRequestPasswordResetRequest {
  email: string;
}

export interface CitizenResetPasswordRequest {
  otp: string;
  email: string;
  newPassword: string;
  confirmPassword: string;
}

export interface CitizenChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
  errors?: Record<string, string[]>;
}
