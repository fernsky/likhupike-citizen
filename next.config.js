const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // [Error: Specified "i18n" cannot be used with "output: export".
  // See more info here: https://nextjs.org/docs/messages/export-no-i18n]
  // output: "export", // Use static export for better performance
  trailingSlash: true, // Add trailing slashes for cleaner URLs
  images: {
    domains: ["localhost", "citizen.likhupike.gov.np", "api.likhupike.gov.np"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.likhupike.gov.np",
        pathname: "**",
      },
    ],
    unoptimized: process.env.NODE_ENV === "development" ? true : false,
  },
  poweredByHeader: false, // Remove the X-Powered-By header for security
  // Environment variables available on the client
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_BASE_URL:
      process.env.NEXT_PUBLIC_BASE_URL || "https://citizen.likhupike.gov.np",
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  // Process critical assets with absolute paths
  assetPrefix: process.env.NEXT_PUBLIC_CDN_URL || "",
  // Note: i18n config is now handled by next-intl plugin
};

module.exports = withNextIntl(nextConfig);
