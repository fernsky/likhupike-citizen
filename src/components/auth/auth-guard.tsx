"use client";

import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { isTokenValid, getAuthToken } from "@/lib/auth-utils";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { useLocale } from "next-intl";

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

  useEffect(() => {
    const token = getAuthToken();

    // If no token or invalid token, redirect to login
    if (!token || !isTokenValid(token)) {
      // Logout to clean up redux state
      dispatch(logout());

      // Get current path for the returnUrl
      const returnUrl = encodeURIComponent(window.location.pathname);

      // Redirect to login with return URL
      router.push(`/${locale}/login?returnUrl=${returnUrl}`);
    }

    // Todo: Check for required role if needed in the future
  }, [router, locale, dispatch, requiredRole]);

  return <>{children}</>;
}
