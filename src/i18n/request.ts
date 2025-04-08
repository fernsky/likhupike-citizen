import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { promises as fs } from "fs";
import path from "path";
import { domains, validateLocale } from "./config";

/**
 * Loads message files for all domains for a specific locale
 */
async function loadDomainMessages(locale: string) {
  const messages: Record<string, unknown> = {};

  for (const domain of domains) {
    try {
      // In production, we use import() for proper bundling
      if (process.env.NODE_ENV === "production") {
        const domainMessages = (
          await import(`../messages/${domain}/${locale}.json`)
        ).default;
        messages[domain] = domainMessages;
      } else {
        // In development, read files directly for better hot reloading
        const filePath = path.join(
          process.cwd(),
          "src",
          "messages",
          domain,
          `${locale}.json`
        );
        const fileContent = await fs.readFile(filePath, "utf8");
        messages[domain] = JSON.parse(fileContent);
      }
    } catch (error) {
      console.error(
        `Failed to load translations for domain ${domain} and locale ${locale}:`,
        error
      );
      // If a domain file is missing, use an empty object for that domain
      messages[domain] = {};
    }
  }

  return messages;
}

export default getRequestConfig(async ({ locale }) => {
  try {
    // Validate that the incoming locale is supported
    validateLocale(locale as string);

    // Load and merge messages for the requested locale from all domains
    const messages = await loadDomainMessages(locale as string);

    // Return locale configuration
    return {
      locale: locale as string,
      messages,
      timeZone: locale === "en" ? "Asia/Kathmandu" : "Asia/Kathmandu",
      // You could add more locale-specific settings here
      // For example, different number formatting or date formats
    };
  } catch (error) {
    console.error(`Error setting up i18n for locale ${locale}:`, error);
    notFound();
  }
});
