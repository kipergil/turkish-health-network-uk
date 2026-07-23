import { DEFAULT_LANGUAGE, type LanguageCode } from "@/lib/i18n/languages";

/**
 * Static UI copy (nav labels, buttons, badges) that isn't admin-authored
 * content — unlike the Directus `translations` collection, which overlays
 * per-record fields, this is a plain compile-time dictionary for chrome
 * that exists regardless of what's in the database.
 *
 * Scope note: this covers the header/nav, shared buttons and badges used
 * across every page — not yet page-specific body copy (About page
 * paragraphs, empty states, form labels, filter panels beyond NHS status).
 * Those would extend this same dictionary later.
 */
const en = {
  nav_home: "Home",
  nav_directory: "Directory",
  nav_map: "Map",
  nav_search: "Search",
  nav_insurance: "Insurance",
  nav_nhs_benefits_guide: "NHS Benefits Guide",
  nav_turkey_referrals: "Recommended in Turkey",
  nav_about: "About",
  nav_favorites: "Favorites",
  nav_suggest_listing: "Suggest a listing",
  nav_your_account_heading: "Your account",
  nav_directory_heading: "Directory",
  nav_explore_heading: "Explore",
  open_menu: "Open menu",
  sign_in: "Sign in",
  change_language: "Change language",
  save: "Save",
  saved: "Saved",
  search_on_google: "Search on Google",
  edit_in_directus: "Edit in Directus",
  view_on_google_maps: "View on Google Maps",
  get_directions: "Get directions",
  verified: "Verified",
  turkish_speaking: "Turkish-speaking",
  nhs_status_nhs: "NHS",
  nhs_status_private: "Private",
  nhs_status_both: "NHS & Private",
} as const;

const tr: Record<keyof typeof en, string> = {
  nav_home: "Ana Sayfa",
  nav_directory: "Dizin",
  nav_map: "Harita",
  nav_search: "Ara",
  nav_insurance: "Sigorta",
  nav_nhs_benefits_guide: "NHS Fayda Rehberi",
  nav_turkey_referrals: "Türkiye'de Tavsiye Edilenler",
  nav_about: "Hakkımızda",
  nav_favorites: "Favoriler",
  nav_suggest_listing: "Kayıt Öner",
  nav_your_account_heading: "Hesabınız",
  nav_directory_heading: "Dizin",
  nav_explore_heading: "Keşfet",
  open_menu: "Menüyü aç",
  sign_in: "Giriş yap",
  change_language: "Dili değiştir",
  save: "Kaydet",
  saved: "Kaydedildi",
  search_on_google: "Google'da Ara",
  edit_in_directus: "Directus'ta Düzenle",
  view_on_google_maps: "Google Haritalar'da Görüntüle",
  get_directions: "Yol Tarifi Al",
  verified: "Doğrulanmış",
  turkish_speaking: "Türkçe Konuşulur",
  nhs_status_nhs: "NHS",
  nhs_status_private: "Özel",
  nhs_status_both: "NHS ve Özel",
};

export const MESSAGES: Record<LanguageCode, Record<keyof typeof en, string>> =
  { en, tr };

export type MessageKey = keyof typeof en;

export function t(key: MessageKey, language: LanguageCode): string {
  return MESSAGES[language]?.[key] ?? MESSAGES[DEFAULT_LANGUAGE][key];
}
