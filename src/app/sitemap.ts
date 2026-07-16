import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants/site";
import {
  PROVIDER_CATEGORY_ROUTES,
  ORGANIZATION_TYPE_ROUTES,
} from "@/lib/constants/categories";
import {
  getAllInsurances,
  getAllOrganizations,
  getAllProviders,
} from "@/lib/data";

const STATIC_ROUTES = [
  "",
  "/map",
  "/search",
  "/insurance",
  "/about",
  "/nhs-doctors",
  ...Object.values(PROVIDER_CATEGORY_ROUTES),
  ...Object.values(ORGANIZATION_TYPE_ROUTES),
].map((route) => (route.startsWith("/") || route === "" ? route : `/${route}`));

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [providers, organizations, insurances] = await Promise.all([
    getAllProviders(),
    getAllOrganizations(),
    getAllInsurances(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: route === "" ? "weekly" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  const providerEntries: MetadataRoute.Sitemap = providers.map((provider) => ({
    url: `${SITE_URL}/${PROVIDER_CATEGORY_ROUTES[provider.category]}/${provider.slug}`,
    lastModified: provider.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const organizationEntries: MetadataRoute.Sitemap = organizations.map(
    (organization) => ({
      url: `${SITE_URL}/${ORGANIZATION_TYPE_ROUTES[organization.type]}/${organization.slug}`,
      lastModified: organization.updatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    }),
  );

  const insuranceEntries: MetadataRoute.Sitemap = insurances.map(
    (insurance) => ({
      url: `${SITE_URL}/insurance/${insurance.slug}`,
      changeFrequency: "monthly",
      priority: 0.5,
    }),
  );

  return [
    ...staticEntries,
    ...providerEntries,
    ...organizationEntries,
    ...insuranceEntries,
  ];
}
