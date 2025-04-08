import { MetadataRoute } from "next";
import { locales } from "@/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://citizen.likhupike.gov.np";

  // Define all routes that should appear in the sitemap
  const routes = [
    "", // Home page
    "/register", // Registration page
    "/login", // Login page
    "/forgot-password", // Forgot password page
    "/services", // Services page
    "/about", // About page
    "/contact", // Contact page
    "/help", // Help page
    "/accessibility", // Accessibility page
    "/terms-of-service", // Terms of service
    "/privacy-policy", // Privacy policy
  ];

  // Create sitemap entries for all routes in all locales
  const sitemap: MetadataRoute.Sitemap = [];

  // Add entries for all localized routes
  locales.forEach((locale) => {
    routes.forEach((route) => {
      sitemap.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : 0.8,
      });
    });
  });

  // Add language-specific pages
  sitemap.push({
    url: `${baseUrl}/language-selection`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  });

  return sitemap;
}
