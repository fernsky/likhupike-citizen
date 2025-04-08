import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

/**
 * Generate SEO metadata for a specific page with proper localization
 *
 * @param locale The current locale
 * @param page The page namespace in SEO translations
 * @param additionalProps Additional metadata properties to include
 * @returns Metadata object for Next.js
 */
export async function generateSEOMetadata(
  locale: string,
  page: string,
  additionalProps: Partial<Metadata> = {}
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: `seo.${page}` });
  const defaultT = await getTranslations({ locale, namespace: "seo.default" });

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://citizen.likhupike.gov.np";

  // Parse keywords from translation if available
  let keywords: string[] = [];
  try {
    if (t("keywords")) {
      keywords = t("keywords")
        .split(",")
        .map((k: string) => k.trim());
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    // Use default keywords if page-specific ones aren't available
    keywords = ["Likhupike", "Digital Profile", "Citizen Portal"];
  }

  // Default metadata
  const metadata: Metadata = {
    title: t("title"),
    description: t("description"),
    keywords,
    alternates: {
      canonical: `${baseUrl}/${locale}/${page === "home" ? "" : page}`,
      languages: {
        en: `${baseUrl}/en/${page === "home" ? "" : page}`,
        ne: `${baseUrl}/ne/${page === "home" ? "" : page}`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${baseUrl}/${locale}/${page === "home" ? "" : page}`,
      siteName: defaultT("title"),
      locale: locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };

  // Merge with any additional properties
  return {
    ...metadata,
    ...additionalProps,
  };
}

/**
 * Generate structured data for improved SEO
 *
 * @param type The type of structured data to generate
 * @param data The data to include in the structured data
 * @returns A script element with JSON-LD structured data
 */
export function generateStructuredData(
  type: "Organization" | "GovernmentOrganization" | "WebSite" | "WebPage",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type,
    ...data,
  };

  return {
    __html: JSON.stringify(structuredData),
  };
}

/**
 * Generate organization structured data for the government organization
 *
 * @returns Structured data for the organization
 */
export function getOrganizationStructuredData() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://citizen.likhupike.gov.np";

  return generateStructuredData("GovernmentOrganization", {
    name: "Likhupike Digital Profile System",
    alternateName: ["LDPS", "लिखुपिके डिजिटल प्रोफाइल प्रणाली"],
    url: baseUrl,
    logo: `${baseUrl}/images/nepal-govt-logo.png`,
    sameAs: [
      "https://www.facebook.com/likhupike",
      "https://twitter.com/likhupike",
      "https://www.youtube.com/c/likhupike",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+977-1-XXXXXXX",
      contactType: "customer service",
      availableLanguage: ["en", "ne"],
    },
  });
}
