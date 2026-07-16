import { z } from "zod";
import {
  accessibilitySchema,
  addressSchema,
  baseEntitySchema,
  contactInfoSchema,
  geoPointSchema,
  languageCodeSchema,
  nhsStatusSchema,
  openingHoursEntrySchema,
} from "@/lib/schemas/common";
import { ORGANIZATION_TYPES } from "@/lib/constants/categories";

export const organizationTypeSchema = z.enum(ORGANIZATION_TYPES);

/**
 * A physical place: clinic, hospital or pharmacy. Providers reference
 * organizations they practice at via `organizationIds`; organizations do
 * not enumerate their providers to avoid a bidirectional sync burden —
 * derive that list at read time (see lib/data/providers.ts#getProvidersByOrganization).
 */
export const organizationSchema = baseEntitySchema.extend({
  type: organizationTypeSchema,
  name: z.string().min(1),
  description: z.string().min(1),
  address: addressSchema,
  geo: geoPointSchema,
  contact: contactInfoSchema.default({}),
  openingHours: z.array(openingHoursEntrySchema).default([]),
  nhsStatus: nhsStatusSchema,
  languagesSpoken: z.array(languageCodeSchema).min(1),
  turkishSpeakingStaff: z.boolean().default(false),
  insuranceIds: z.array(z.string().min(1)).default([]),
  specialityIds: z.array(z.string().min(1)).default([]),
  accessibility: accessibilitySchema.optional(),
  images: z.array(z.string()).default([]),
  googleMapsUrl: z.url().optional(),
});

export type Organization = z.infer<typeof organizationSchema>;

export const organizationsFileSchema = z.array(organizationSchema);
