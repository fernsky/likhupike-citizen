/**
 * Protected paths that require authentication
 */
export const protectedPaths = [
  "/dashboard",
  "/dashboard/*",
  "/profile",
  "/settings",
  "/documents",
];

/**
 * Public paths that don't require authentication
 */
export const publicPaths = [
  "/",
  "/login",
  "/register",
  "/registration-success",
  "/forgot-password",
  "/reset-password",
  "/about",
  "/contact",
  "/help",
  "/citizen-guide",
];

/**
 * Auth configuration settings
 */
export const authConfig = {
  loginRedirectPath: "/login",
  defaultRedirectAfterLogin: "/dashboard",
  tokenExpireTolerance: 60 * 5, // 5 minutes in seconds
};
