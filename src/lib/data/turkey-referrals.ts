import "server-only";
import turkeyReferralsJson from "@data/turkey-referrals.json";
import {
  turkeyReferralsFileSchema,
  type TurkeyReferral,
  type TurkeyReferralKind,
} from "@/lib/schemas";

const allTurkeyReferrals: TurkeyReferral[] =
  turkeyReferralsFileSchema.parse(turkeyReferralsJson);

export async function getAllTurkeyReferrals(): Promise<TurkeyReferral[]> {
  return allTurkeyReferrals;
}

export async function getTurkeyReferralsByKind(
  kind: TurkeyReferralKind,
): Promise<TurkeyReferral[]> {
  return allTurkeyReferrals.filter((referral) => referral.kind === kind);
}

export async function getTurkeyReferralBySlug(
  slug: string,
): Promise<TurkeyReferral | undefined> {
  return allTurkeyReferrals.find((referral) => referral.slug === slug);
}
