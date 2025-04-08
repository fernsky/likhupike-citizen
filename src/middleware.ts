import createMiddleware from "next-intl/middleware";
import { locales } from "./i18n";
import { NextRequest, NextResponse } from "next/server";

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

// Custom middleware that combines i18n functionality with security headers
export default function middleware(request: NextRequest) {
  // Process internationalization first
  const response = intlMiddleware(request);

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
  // Match only internationalized pathnames (excluding API routes, static files, etc.)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
