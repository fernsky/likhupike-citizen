import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Inter } from "next/font/google";

/**
 * Utility function to merge Tailwind CSS classes safely
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Check if code is running on the client side (browser)
export const isClient = typeof window !== "undefined";

// Helper to safely get error messages from various error formats
export function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;

  // For API errors that might be in different formats
  if (error && typeof error === "object") {
    if ("message" in error && typeof error.message === "string")
      return error.message;

    if ("error" in error && typeof error.error === "string") return error.error;

    if ("data" in error && error.data && typeof error.data === "object") {
      if ("message" in error.data && typeof error.data.message === "string")
        return error.data.message;
    }
  }

  return "An unexpected error occurred";
}

// Define Inter font for English
export const InterFont = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});
