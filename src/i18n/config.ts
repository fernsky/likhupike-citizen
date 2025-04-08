import { notFound } from "next/navigation";

// Define the list of all supported locales
export const locales = ["en", "ne"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale = "en" as const;

// Define domains for which we have translations
export const domains = ["common", "auth", "citizen", "seo"] as const;
export type Domain = (typeof domains)[number];

// Define locale display names
export const localeNames: Record<string, string> = {
  en: "English",
  ne: "नेपाली",
};

// Define time zones by locale
export const timeZones: Record<string, string> = {
  en: "Asia/Kathmandu",
  ne: "Asia/Kathmandu",
};

// Define date formats by locale
export const dateFormats: Record<string, Intl.DateTimeFormatOptions> = {
  en: {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
  ne: {
    year: "numeric",
    month: "long",
    day: "numeric",
  },
};

// Utility function to validate locale
export function validateLocale(locale: string): asserts locale is Locale {
  if (!locales.includes(locale as Locale)) {
    notFound();
  }
}
