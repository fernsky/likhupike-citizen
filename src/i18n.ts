import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { promises as fs } from "fs";
import path from "path";

// Define the list of all supported locales
export const locales = ["en", "ne"] as const;
export type Locale = (typeof locales)[number];

// Define the domains for which we have translations
const domains = ["common", "seo", "auth", "citizen"];

async function loadDomainMessages(locale: string) {
  const messages: Record<string, unknown> = {};

  for (const domain of domains) {
    try {
      // In production, we need to use import() for proper bundling
      if (process.env.NODE_ENV === "production") {
        const domainMessages = (
          await import(`./messages/${domain}/${locale}.json`)
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
  // Validate that the incoming locale is supported
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Load and merge messages for the requested locale from all domains
  const messages = await loadDomainMessages(locale as string);

  // Make sure locale is definitely a string to satisfy TypeScript
  const safeLocale: string = locale as string;

  // Return both locale and messages as required by RequestConfig type
  return {
    locale: safeLocale,
    messages: messages,
    // You can also add other optional properties like timeZone if needed
    // timeZone: 'Asia/Kathmandu',
  };
});
