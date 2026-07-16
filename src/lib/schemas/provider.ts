import { z } from "zod";
import {
  accessibilitySchema,
  baseEntitySchema,
  contactInfoSchema,
  languageCodeSchema,
  nhsStatusSchema,
  openingHoursEntrySchema,
  registrationBodySchema,
} from "@/lib/schemas/common";
import { PROVIDER_CATEGORIES } from "@/lib/constants/categories";

export const providerCategorySchema = z.enum(PROVIDER_CATEGORIES);

/**
 * An individual practitioner: doctor, dentist, psychologist,
 * physiotherapist or dietitian. "NHS Doctors" is a filtered view of
 * category "doctor" (see lib/data/providers.ts#getNhsDoctors), not a
 * distinct category, to avoid duplicating practitioner records.
 */
export const providerSchema = baseEntitySchema.extend({
  category: providerCategorySchema,
  name: z.string().min(1),
  title: z.string().min(1),
  photoUrl: z.string().optional(),
  bio: z.string().min(1),
  qualifications: z.array(z.string().min(1)).default([]),
  registrationBody: registrationBodySchema.optional(),
  registrationNumber: z.string().optional(),
  yearsOfExperience: z.number().int().min(0).optional(),
  specialityIds: z.array(z.string().min(1)).default([]),
  languagesSpoken: z.array(languageCodeSchema).min(1),
  turkishSpeaking: z.boolean().default(false),
  nhsStatus: nhsStatusSchema,
  organizationIds: z.array(z.string().min(1)).default([]),
  insuranceIds: z.array(z.string().min(1)).default([]),
  accessibility: accessibilitySchema.optional(),
  openingHours: z.array(openingHoursEntrySchema).default([]),
  contact: contactInfoSchema.default({}),
  googleMapsUrl: z.url().optional(),
});

export type Provider = z.infer<typeof providerSchema>;

export const providersFileSchema = z.array(providerSchema);
