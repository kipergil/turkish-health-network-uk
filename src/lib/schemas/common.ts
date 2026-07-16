import { z } from "zod";
import { LANGUAGE_CODES } from "@/lib/constants/languages";
import { NHS_STATUSES, REGISTRATION_BODIES } from "@/lib/constants/categories";

/** Lowercase, hyphen-separated identifier used in URLs. */
export const slugSchema = z
  .string()
  .min(1)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must be lowercase, hyphen-separated",
  );

export const languageCodeSchema = z.enum(LANGUAGE_CODES);

export const nhsStatusSchema = z.enum(NHS_STATUSES);

export const registrationBodySchema = z.enum(REGISTRATION_BODIES);

export const geoPointSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});
export type GeoPoint = z.infer<typeof geoPointSchema>;

export const addressSchema = z.object({
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  postcode: z.string().min(1),
  region: z.string().optional(),
  country: z.string().default("United Kingdom"),
});
export type Address = z.infer<typeof addressSchema>;

export const contactInfoSchema = z.object({
  phone: z.string().optional(),
  email: z.email().optional(),
  website: z.url().optional(),
});
export type ContactInfo = z.infer<typeof contactInfoSchema>;

export const weekdaySchema = z.enum([
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);
export type Weekday = z.infer<typeof weekdaySchema>;

export const openingHoursEntrySchema = z.object({
  day: weekdaySchema,
  opens: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Expected HH:mm")
    .optional(),
  closes: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Expected HH:mm")
    .optional(),
  closed: z.boolean().default(false),
});
export type OpeningHoursEntry = z.infer<typeof openingHoursEntrySchema>;

export const accessibilitySchema = z.object({
  wheelchairAccessible: z.boolean().default(false),
  stepFreeAccess: z.boolean().default(false),
  accessibleToilet: z.boolean().default(false),
  hearingLoop: z.boolean().default(false),
  signLanguageAvailable: z.boolean().default(false),
  assistanceDogsWelcome: z.boolean().default(false),
});
export type Accessibility = z.infer<typeof accessibilitySchema>;

/**
 * Fields shared by every top-level entity. Mirrors the columns every
 * Prisma model will carry once a database is introduced (id/timestamps),
 * so the JSON-first repositories below can be swapped for real queries
 * without reshaping callers.
 */
export const baseEntitySchema = z.object({
  id: z.string().min(1),
  slug: slugSchema,
  verified: z.boolean().default(false),
  featured: z.boolean().default(false),
  createdAt: z.iso.date(),
  updatedAt: z.iso.date(),
});
