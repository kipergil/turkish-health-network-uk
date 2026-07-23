import type { LucideIcon } from "lucide-react";
import {
  Stethoscope,
  Smile,
  Brain,
  Activity,
  Salad,
  ShieldPlus,
  Building2,
  Hospital,
  Pill,
  MapPinned,
  Search,
  ShieldCheck,
  Plane,
  Info,
  Heart,
  FilePlus,
  BookOpen,
} from "lucide-react";
import {
  PROVIDER_CATEGORIES,
  PROVIDER_CATEGORY_PLURAL_LABELS,
  PROVIDER_CATEGORY_ROUTES,
  ORGANIZATION_TYPES,
  ORGANIZATION_TYPE_PLURAL_LABELS,
  ORGANIZATION_TYPE_ROUTES,
  type ProviderCategory,
  type OrganizationType,
} from "@/lib/constants/categories";
import { NHS_BENEFITS_GUIDE_SLUG } from "@/lib/constants/pages";

export interface NavItem {
  label: string;
  href: string;
  description: string;
  icon: LucideIcon;
}

const PROVIDER_CATEGORY_ICONS: Record<ProviderCategory, LucideIcon> = {
  doctor: Stethoscope,
  dentist: Smile,
  psychologist: Brain,
  physiotherapist: Activity,
  dietitian: Salad,
};

const ORGANIZATION_TYPE_ICONS: Record<OrganizationType, LucideIcon> = {
  clinic: Building2,
  hospital: Hospital,
  pharmacy: Pill,
};

export const PROVIDER_NAV_ITEMS: NavItem[] = PROVIDER_CATEGORIES.map(
  (category) => ({
    label: PROVIDER_CATEGORY_PLURAL_LABELS[category],
    href: `/${PROVIDER_CATEGORY_ROUTES[category]}`,
    description: `Find Turkish-speaking ${PROVIDER_CATEGORY_PLURAL_LABELS[category].toLowerCase()} near you`,
    icon: PROVIDER_CATEGORY_ICONS[category],
  }),
);

export const ORGANIZATION_NAV_ITEMS: NavItem[] = ORGANIZATION_TYPES.map(
  (type) => ({
    label: ORGANIZATION_TYPE_PLURAL_LABELS[type],
    href: `/${ORGANIZATION_TYPE_ROUTES[type]}`,
    description: `Browse ${ORGANIZATION_TYPE_PLURAL_LABELS[type].toLowerCase()} across the UK`,
    icon: ORGANIZATION_TYPE_ICONS[type],
  }),
);

export const NHS_DOCTORS_NAV_ITEM: NavItem = {
  label: "NHS Doctors",
  href: "/nhs-doctors",
  description: "Doctors accepting NHS patients",
  icon: ShieldPlus,
};

export const DIRECTORY_NAV_ITEMS: NavItem[] = [
  ...PROVIDER_NAV_ITEMS,
  NHS_DOCTORS_NAV_ITEM,
  ...ORGANIZATION_NAV_ITEMS,
];

export const UTILITY_NAV_ITEMS: NavItem[] = [
  {
    label: "Map",
    href: "/map",
    description: "Explore providers on an interactive map",
    icon: MapPinned,
  },
  {
    label: "Search",
    href: "/search",
    description: "Search the whole network",
    icon: Search,
  },
  {
    label: "Insurance",
    href: "/insurance",
    description: "Insurers accepted across the network",
    icon: ShieldCheck,
  },
  {
    label: "NHS Benefits Guide",
    href: `/pages/${NHS_BENEFITS_GUIDE_SLUG}`,
    description: "How to benefit from NHS insurance and health services in the UK",
    icon: BookOpen,
  },
  {
    label: "Recommended in Turkey",
    href: "/turkey-doctors",
    description:
      "Doctors, dentists and clinics in Turkey recommended for treatment trips",
    icon: Plane,
  },
  {
    label: "About",
    href: "/about",
    description: "About Turkish Health Network UK",
    icon: Info,
  },
];

/** Clerk-gated member features — kept separate from UTILITY_NAV_ITEMS since
 * these require signing in, not just content categories. */
export const MEMBER_NAV_ITEMS: NavItem[] = [
  {
    label: "Favorites",
    href: "/favorites",
    description: "Providers and organizations you've saved",
    icon: Heart,
  },
  {
    label: "Suggest a listing",
    href: "/suggest",
    description: "Suggest a doctor, clinic or organization to add",
    icon: FilePlus,
  },
];

export const PRIMARY_NAV_ITEMS: NavItem[] = [
  {
    label: "Home",
    href: "/",
    description: "Turkish Health Network UK",
    icon: ShieldCheck,
  },
  ...DIRECTORY_NAV_ITEMS,
  ...UTILITY_NAV_ITEMS,
];
