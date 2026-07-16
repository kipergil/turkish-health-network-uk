import { z } from "zod";
import { slugSchema } from "@/lib/schemas/common";

export const insuranceKindSchema = z.enum([
  "private-health-insurance",
  "cash-plan",
  "nhs-scheme",
]);
export type InsuranceKind = z.infer<typeof insuranceKindSchema>;

/**
 * An insurance/payment scheme that providers and organizations can accept.
 * Acceptance is recorded on the provider/organization record (`insuranceIds`)
 * rather than here, so a single insurer record can be referenced network-wide.
 */
export const insuranceSchema = z.object({
  id: z.string().min(1),
  slug: slugSchema,
  name: z.string().min(1),
  kind: insuranceKindSchema,
  description: z.string().min(1),
  website: z.url().optional(),
  logoUrl: z.string().optional(),
});

export type Insurance = z.infer<typeof insuranceSchema>;

export const insurancesFileSchema = z.array(insuranceSchema);
