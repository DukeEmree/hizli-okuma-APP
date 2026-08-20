/**
 * Hosted legal documents.
 *
 * Google Play requires a publicly reachable Privacy Policy URL for the store
 * listing, and the same pages are linked from Settings so a user can reach
 * them without leaving the app's context. Kept in one place so pointing them
 * at a different host later is a single edit rather than a search.
 */
export const LEGAL_URLS = {
  privacyPolicy: 'https://hizliokuma.dukeemree.xyz/privacy',
  termsOfService: 'https://hizliokuma.dukeemree.xyz/terms',
} as const;
