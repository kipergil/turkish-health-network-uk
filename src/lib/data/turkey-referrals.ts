import "server-only";
import { cache } from "react";
import { readItems } from "@directus/sdk";
import { directus } from "@/lib/directus/client";
import { stripNulls } from "@/lib/directus/normalize";
import { applyTranslations } from "@/lib/i18n/apply-translations";
import {
  turkeyReferralsFileSchema,
  type TurkeyReferral,
  type TurkeyReferralKind,
} from "@/lib/schemas";

export const getAllTurkeyReferrals = cache(
  async (): Promise<TurkeyReferral[]> => {
    const items = await directus.request(
      readItems("turkey_referrals", { limit: -1 }),
    );
    const referrals = turkeyReferralsFileSchema.parse(stripNulls(items));
    return applyTranslations("turkey_referrals", referrals, [
      "specialityText",
      "notes",
    ]);
  },
);

export async function getTurkeyReferralsByKind(
  kind: TurkeyReferralKind,
): Promise<TurkeyReferral[]> {
  const referrals = await getAllTurkeyReferrals();
  return referrals.filter((referral) => referral.kind === kind);
}

export async function getTurkeyReferralBySlug(
  slug: string,
): Promise<TurkeyReferral | undefined> {
  const referrals = await getAllTurkeyReferrals();
  return referrals.find((referral) => referral.slug === slug);
}
