import { useTranslations } from "next-intl";

/**
 * Custom hook to get domain-specific translations with proper nesting
 *
 * @param domain The domain namespace for translations (e.g., 'auth', 'citizen')
 * @returns A translation function that prepends the domain to the key
 */
export function useDomainTranslations(domain: string) {
  try {
    const baseTranslate = useTranslations(domain);
    return baseTranslate;
  } catch (error) {
    console.error(`Error loading translations for domain ${domain}:`, error);

    // Return a fallback function that returns the key when translation fails
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (key: string, vars?: Record<string, unknown>) => {
      console.warn(`Translation missing: ${domain}.${key}`);
      return key;
    };
  }
}

/**
 * Custom hook to get common translations that are shared across domains
 *
 * @returns A translation function for common translations
 */
export function useCommonTranslations() {
  try {
    return useTranslations("common");
  } catch (error) {
    console.error("Error loading common translations:", error);

    // Return a fallback function that returns the key when translation fails
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (key: string, vars?: Record<string, unknown>) => {
      console.warn(`Common translation missing: ${key}`);
      return key;
    };
  }
}

/**
 * Helper to create domain-specific translation keys for components
 *
 * @param domain The domain namespace for translations
 * @param key The specific key within that domain
 * @returns The properly formatted translation key
 */
export function getDomainKey(domain: string, key: string): string {
  return `${domain}.${key}`;
}
