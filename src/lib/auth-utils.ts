import { jwtDecode } from "jwt-decode";
import { isClient } from "./utils";
import { authConfig } from "@/config/middleware-config";
import Cookies from "js-cookie";

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
    // Skip validation if token is undefined or empty
    if (!token || token === "undefined") {
      console.error("Token is undefined or empty");
      return false;
    }
    
    // Decode JWT without verifying signature (signature verification happens on server)
    const decoded = jwtDecode<JwtPayload>(token);
    
    // Check if token has expired (with tolerance for refresh)
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Return true if current time is less than expiration time
    return decoded.exp > currentTime;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
}

/**
 * Check if token will expire soon and should be refreshed
 */
export function shouldRefreshToken(token: string): boolean {
  try {
    // Skip validation if token is undefined or empty
    if (!token || token === "undefined") {
      return false;
    }
    
    const decoded = jwtDecode<JwtPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    
    // Return true if token will expire within tolerance window
    return decoded.exp - currentTime < authConfig.tokenExpireTolerance;
  } catch {
    return false;
  }
}

/**
 * Get auth token from localStorage and sync with cookie for SSR
 */
export function getAuthToken(): string | null {
  if (!isClient) return null;

  const token = localStorage.getItem("auth_token");
  
  // If token exists in localStorage but not in cookies, sync them
  // This ensures middleware can access the token
  if (token && token !== "undefined") {
    // Get token expiry from localStorage
    const tokenExpiry = localStorage.getItem("token_expiry");
    const expiryDate = tokenExpiry ? new Date(Number(tokenExpiry)) : undefined;
    
    // Set or update the cookie
    Cookies.set("auth_token", token, {
      expires: expiryDate,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Changed to 'lax' to be more permissive, especially with redirects
      path: '/' // Ensure cookie is available for all paths
    });
  } else if (Cookies.get("auth_token") && (!token || token === "undefined")) {
    // If cookie exists but localStorage doesn't have token, remove the cookie
    Cookies.remove("auth_token", { path: '/' });
  }
  
  return token && token !== "undefined" ? token : null;
}

/**
 * Set auth token in both localStorage and cookies
 */
export function setAuthToken(token: string, expiresIn: number): void {
  if (!isClient) return;
  
  // Don't set undefined tokens
  if (!token || token === "undefined") {
    console.error("Attempted to set undefined token");
    return;
  }
  
  localStorage.setItem("auth_token", token);
  localStorage.setItem("token_expiry", String(Date.now() + expiresIn * 1000));
  
  // Also set in cookies for SSR/middleware
  Cookies.set("auth_token", token, {
    expires: new Date(Date.now() + expiresIn * 1000),
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // Changed to 'lax' to be more permissive
    path: '/' // Ensure cookie is available for all paths
  });
  
  // Verify cookie was set
  const cookieValue = Cookies.get("auth_token");
  if (!cookieValue || cookieValue === "undefined") {
    console.error("Failed to set auth_token cookie");
  }
}

/**
 * Remove auth token from both localStorage and cookies
 */
export function removeAuthToken(): void {
  if (!isClient) return;
  
  localStorage.removeItem("auth_token");
  localStorage.removeItem("token_expiry");
  Cookies.remove("auth_token", { path: '/' });
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
