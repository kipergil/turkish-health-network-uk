import type { TurkeyReferralKind } from "@/lib/schemas/turkey-referral";

export const TURKEY_REFERRAL_KIND_LABELS: Record<TurkeyReferralKind, string> = {
  doctor: "Doctor",
  dentist: "Dentist",
  clinic: "Clinic / Platform",
};

export const TURKEY_REFERRAL_KIND_PLURAL_LABELS: Record<
  TurkeyReferralKind,
  string
> = {
  doctor: "Doctors",
  dentist: "Dentists",
  clinic: "Clinics & Platforms",
};
