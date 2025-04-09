import createMiddleware from "next-intl/middleware";
import { locales } from "./i18n";
import { NextRequest, NextResponse } from "next/server";
import { isTokenValid } from "./lib/auth-utils";
import { protectedPaths, authConfig } from "./config/middleware-config";

// Create standard internationalization middleware
const intlMiddleware = createMiddleware({
  // The list of available locales
  locales: locales,
  // Define the default locale to use when none is selected
  defaultLocale: "en",
  // Automatically detect the locale based on request headers and cookies
  localeDetection: true,
  // Define locale prefix strategy (always include locale prefix in URL)
  localePrefix: "always",
});

// Custom middleware that combines i18n functionality with authentication and security headers
export default function middleware(request: NextRequest) {
  // Check if the request is for a static file or Next.js resource
  const { pathname } = request.nextUrl;
  const isStaticResource = [
    // Next.js static files and API routes
    "/_next/",
    "/api/",
    // Common static file extensions
    ".css",
    ".js",
    ".json",
    ".ico",
    ".png",
    ".jpg",
    ".jpeg",
    ".svg",
    ".webp",
    ".woff",
    ".woff2",
    ".ttf",
  ].some((path) => pathname.includes(path));

  // Skip middleware for static resources
  if (isStaticResource) {
    return NextResponse.next();
  }

  // Process internationalization
  const response = intlMiddleware(request);

  // Extract path from request
  const path = request.nextUrl.pathname;

  // Check if the path is a protected route
  const isProtectedRoute = protectedPaths.some((protectedPath) => {
    if (protectedPath.endsWith("/*")) {
      const basePath = protectedPath.slice(0, -2);
      return path.startsWith(basePath);
    }
    return path === protectedPath;
  });

  if (isProtectedRoute) {
    // Get auth token and check if it's valid
    const token = request.cookies.get("auth_token")?.value;
    console.log(request.cookies);
    // If no token or token is "undefined" string or invalid, redirect to login
    if (!token || token === "undefined" || !isTokenValid(token)) {
      // Get locale from path
      const locale = path.split("/")[1] || "en";

      // Create redirect URL to login page with return URL
      const returnUrl = encodeURIComponent(path);
      const loginUrl = new URL(
        `/${locale}${authConfig.loginRedirectPath}?returnUrl=${returnUrl}`,
        request.url
      );

      // Return redirect response
      return NextResponse.redirect(loginUrl);
    }
  }

  if (response) {
    // Add security headers to the response
    response.headers.set("X-DNS-Prefetch-Control", "on");
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "SAMEORIGIN");
    response.headers.set("Referrer-Policy", "origin-when-cross-origin");
    response.headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()"
    );

    // Prevent this site from being indexed in non-production environments
    if (process.env.NODE_ENV !== "production") {
      response.headers.set("X-Robots-Tag", "noindex, nofollow");
    }

    // Add Likhupike-specific custom header
    response.headers.set("X-Likhupike-Portal", "citizen");

    return response;
  }

  return NextResponse.next();
}

export const config = {
  // Update matcher configuration to properly exclude static resources
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (public assets)
     * Also exclude API routes
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)",
    // Include only the protected routes that need auth checking
    ...protectedPaths.map((path) =>
      path.endsWith("/*")
        ? `/:locale${path.slice(0, -2)}/:path*`
        : `/:locale${path}`
    ),
  ],
};
