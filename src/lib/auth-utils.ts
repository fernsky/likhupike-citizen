import { jwtDecode } from "jwt-decode";
import { isClient } from "./utils";

/**
 * Interface for JWT payload
 */
export interface JwtPayload {
  sub: string; // Citizen ID
  exp: number; // Expiration timestamp
  iat: number; // Issued at timestamp
  roles: string[]; // User roles
}

/**
 * Check if a JWT token is valid and not expired
 */
export function isTokenValid(token: string): boolean {
  try {
    // Decode JWT without verifying signature (signature verification happens on server)
    const decoded = jwtDecode<JwtPayload>(token);
    console.log(decoded);
    // Check if token has expired
    const currentTime = Math.floor(Date.now() / 1000);

    return decoded.exp > currentTime;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
}

/**
 * Get auth token from localStorage or cookie
 */
export function getAuthToken(): string | null {
  if (!isClient) return null;

  return localStorage.getItem("auth_token");
}

/**
 * Get user info from token
 */
export function getUserFromToken(token: string | null): {
  citizenId: string;
  roles: string[];
  isAuthenticated: boolean;
} {
  const defaultUser = { citizenId: "", roles: [], isAuthenticated: false };

  if (!token) return defaultUser;

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    return {
      citizenId: decoded.sub,
      roles: decoded.roles || [],
      isAuthenticated: decoded.exp > Math.floor(Date.now() / 1000),
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return defaultUser;
  }
}

/**
 * Check if the current user has specific roles
 */
export function userHasRole(
  token: string | null,
  requiredRole: string
): boolean {
  if (!token) return false;

  const { roles, isAuthenticated } = getUserFromToken(token);

  // User must be authenticated and have the required role
  return isAuthenticated && roles.includes(requiredRole);
}
