import type {
  AppUser,
  Favorite,
  Insurance,
  ListingSuggestion,
  Organization,
  Provider,
  Review,
  Speciality,
  TurkeyReferral,
} from "@/lib/schemas";

/**
 * Maps every Directus collection this app uses to its item shape. Field
 * names deliberately match the Zod schema keys 1:1 (camelCase, not
 * Directus's usual snake_case convention) so an item read from Directus
 * can be validated by the *existing* schema — `providerSchema.parse(item)`
 * — with zero remapping between the two layers.
 */
export interface DirectusSchema {
  providers: Provider[];
  organizations: Organization[];
  specialities: Speciality[];
  insurances: Insurance[];
  turkey_referrals: TurkeyReferral[];
  app_users: AppUser[];
  favorites: Favorite[];
  reviews: Review[];
  listing_suggestions: ListingSuggestion[];
}

export type DirectusCollectionName = keyof DirectusSchema;
