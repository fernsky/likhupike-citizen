"use client";

import { useRouter } from "next/navigation";
import { useEffect, ReactNode, useState } from "react";
import {
  isTokenValid,
  getAuthToken,
  shouldRefreshToken,
  getUserFromToken,
} from "@/lib/auth-utils";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { useLocale } from "next-intl";
import { authConfig } from "@/config/middleware-config";
import { RootState } from "@/store";
import { useRefreshTokenMutation } from "@/store/services/authApi";

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: string;
}

/**
 * Client-side auth guard component to protect routes
 * This provides additional protection beyond the middleware
 * and handles special cases like token expiration during an active session
 */
export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter();
  const locale = useLocale();
  const dispatch = useDispatch();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [refreshToken] = useRefreshTokenMutation();
  const { refreshToken: storedRefreshToken } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const handleUnauthorized = () => {
      // Logout to clean up redux state
      dispatch(logout());

      // Get current path for the returnUrl
      const returnUrl = encodeURIComponent(window.location.pathname);

      // Redirect to login with return URL
      router.push(
        `/${locale}${authConfig.loginRedirectPath}?returnUrl=${returnUrl}`
      );
    };

    const validateAuth = async () => {
      const token = getAuthToken();

      // If no token, redirect to login
      if (!token) {
        handleUnauthorized();
        return;
      }

      // If token is valid but about to expire, try refreshing
      if (
        isTokenValid(token) &&
        shouldRefreshToken(token) &&
        storedRefreshToken
      ) {
        try {
          await refreshToken(storedRefreshToken).unwrap();
          // After successful refresh, continue
        } catch (error) {
          console.error("Token refresh failed:", error);
          // If refresh fails, log the user out
          handleUnauthorized();
          return;
        }
      }

      // If token is invalid, redirect to login
      if (!isTokenValid(token)) {
        handleUnauthorized();
        return;
      }

      // Check for role requirement if specified
      if (requiredRole) {
        const { roles } = getUserFromToken(token);
        if (!roles.includes(requiredRole)) {
          // User doesn't have required role, redirect to dashboard
          router.push(`/${locale}/dashboard`);
          return;
        }
      }

      // User is authorized
      setIsAuthorized(true);
    };

    validateAuth();
  }, [
    router,
    locale,
    dispatch,
    requiredRole,
    refreshToken,
    storedRefreshToken,
  ]);

  // Show nothing while checking authorization
  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
