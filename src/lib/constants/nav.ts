import {
  PROVIDER_CATEGORIES,
  PROVIDER_CATEGORY_PLURAL_LABELS,
  PROVIDER_CATEGORY_ROUTES,
  ORGANIZATION_TYPES,
  ORGANIZATION_TYPE_PLURAL_LABELS,
  ORGANIZATION_TYPE_ROUTES,
} from "@/lib/constants/categories";

export interface NavItem {
  label: string;
  href: string;
  description: string;
}

export const PROVIDER_NAV_ITEMS: NavItem[] = PROVIDER_CATEGORIES.map(
  (category) => ({
    label: PROVIDER_CATEGORY_PLURAL_LABELS[category],
    href: `/${PROVIDER_CATEGORY_ROUTES[category]}`,
    description: `Find Turkish-speaking ${PROVIDER_CATEGORY_PLURAL_LABELS[category].toLowerCase()} near you`,
  }),
);

export const ORGANIZATION_NAV_ITEMS: NavItem[] = ORGANIZATION_TYPES.map(
  (type) => ({
    label: ORGANIZATION_TYPE_PLURAL_LABELS[type],
    href: `/${ORGANIZATION_TYPE_ROUTES[type]}`,
    description: `Browse ${ORGANIZATION_TYPE_PLURAL_LABELS[type].toLowerCase()} across the UK`,
  }),
);

export const NHS_DOCTORS_NAV_ITEM: NavItem = {
  label: "NHS Doctors",
  href: "/nhs-doctors",
  description: "Doctors accepting NHS patients",
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
  },
  { label: "Search", href: "/search", description: "Search the whole network" },
  {
    label: "Insurance",
    href: "/insurance",
    description: "Insurers accepted across the network",
  },
  {
    label: "About",
    href: "/about",
    description: "About Turkish Health Network UK",
  },
];

export const PRIMARY_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/", description: "Turkish Health Network UK" },
  ...DIRECTORY_NAV_ITEMS,
  ...UTILITY_NAV_ITEMS,
];
