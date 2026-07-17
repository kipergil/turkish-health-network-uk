import { z } from "zod";
import { slugSchema } from "@/lib/schemas/common";

/**
 * A doctor, dentist or clinic based in Turkey, recommended within the UK
 * Turkish-speaking community for patients travelling for treatment.
 *
 * Deliberately a separate, lighter schema from Provider/Organization: these
 * entities have no UK address, no NHS status, and are not overseen by UK
 * regulators (GMC/GDC/CQC) — attaching them to the UK schemas would imply a
 * level of UK oversight that doesn't apply. `specialityText` and `city` are
 * free text rather than references into the UK speciality taxonomy, since
 * Turkish specialities/qualifications don't map cleanly onto it.
 */
export const turkeyReferralKindSchema = z.enum(["doctor", "dentist", "clinic"]);
export type TurkeyReferralKind = z.infer<typeof turkeyReferralKindSchema>;

export const turkeyReferralSchema = z.object({
  id: z.string().min(1),
  slug: slugSchema,
  kind: turkeyReferralKindSchema,
  name: z.string().min(1),
  title: z.string().optional(),
  specialityText: z.string().min(1),
  city: z.string().min(1),
  affiliation: z.string().optional(),
  phone: z.string().optional(),
  website: z.url().optional(),
  notes: z.string().optional(),
  verified: z.boolean().default(false),
});

export type TurkeyReferral = z.infer<typeof turkeyReferralSchema>;

export const turkeyReferralsFileSchema = z.array(turkeyReferralSchema);
