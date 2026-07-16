/**
 * A "provider" is an individual practitioner. The category drives which
 * top-level section (Doctors, Dentists, ...) a provider appears under.
 * NHS Doctors is not a separate category — it is doctors filtered by
 * `nhsStatus`, see lib/data/providers.ts#getNhsDoctors.
 */
export const PROVIDER_CATEGORIES = [
  "doctor",
  "dentist",
  "psychologist",
  "physiotherapist",
  "dietitian",
] as const;

export type ProviderCategory = (typeof PROVIDER_CATEGORIES)[number];

export const PROVIDER_CATEGORY_LABELS: Record<ProviderCategory, string> = {
  doctor: "Doctor",
  dentist: "Dentist",
  psychologist: "Psychologist",
  physiotherapist: "Physiotherapist",
  dietitian: "Dietitian",
};

export const PROVIDER_CATEGORY_PLURAL_LABELS: Record<ProviderCategory, string> =
  {
    doctor: "Doctors",
    dentist: "Dentists",
    psychologist: "Psychologists",
    physiotherapist: "Physiotherapists",
    dietitian: "Dietitians",
  };

/** An "organization" is a physical place: a clinic, hospital or pharmacy. */
export const ORGANIZATION_TYPES = ["clinic", "hospital", "pharmacy"] as const;

export type OrganizationType = (typeof ORGANIZATION_TYPES)[number];

export const ORGANIZATION_TYPE_LABELS: Record<OrganizationType, string> = {
  clinic: "Clinic",
  hospital: "Hospital",
  pharmacy: "Pharmacy",
};

export const ORGANIZATION_TYPE_PLURAL_LABELS: Record<OrganizationType, string> =
  {
    clinic: "Clinics",
    hospital: "Hospitals",
    pharmacy: "Pharmacies",
  };

/** URL path segments — deliberately explicit rather than `${type}s` since "pharmacy" pluralizes irregularly. */
export const PROVIDER_CATEGORY_ROUTES: Record<ProviderCategory, string> = {
  doctor: "doctors",
  dentist: "dentists",
  psychologist: "psychologists",
  physiotherapist: "physiotherapists",
  dietitian: "dietitians",
};

export const ORGANIZATION_TYPE_ROUTES: Record<OrganizationType, string> = {
  clinic: "clinics",
  hospital: "hospitals",
  pharmacy: "pharmacies",
};

export const NHS_STATUSES = ["nhs", "private", "both"] as const;
export type NhsStatus = (typeof NHS_STATUSES)[number];

export const NHS_STATUS_LABELS: Record<NhsStatus, string> = {
  nhs: "NHS",
  private: "Private",
  both: "NHS & Private",
};

export const REGISTRATION_BODIES = [
  "GMC",
  "GDC",
  "HCPC",
  "NMC",
  "BACP",
  "BPS",
  "GPhC",
] as const;

export type RegistrationBody = (typeof REGISTRATION_BODIES)[number];
