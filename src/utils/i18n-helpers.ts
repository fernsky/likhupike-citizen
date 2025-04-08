import { useTranslations } from "next-intl";

/**
 * Custom hook to get domain-specific translations with proper nesting
 *
 * @param domain The domain namespace for translations (e.g., 'auth', 'citizen')
 * @returns A translation function that prepends the domain to the key
 */
export function useDomainTranslations(domain: string) {
  const baseTranslate = useTranslations(domain);

  return baseTranslate;
}

/**
 * Custom hook to get common translations that are shared across domains
 *
 * @returns A translation function for common translations
 */
export function useCommonTranslations() {
  return useTranslations("common");
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
