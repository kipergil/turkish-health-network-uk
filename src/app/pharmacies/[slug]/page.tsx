import type { Metadata } from "next";
import {
  OrganizationProfileView,
  loadOrganizationForType,
} from "@/components/organizations/organization-profile-view";
import { getOrganizationsByType } from "@/lib/data";
import { organizationProfileMetadata } from "@/lib/seo/page-metadata";

export async function generateStaticParams() {
  const organizations = await getOrganizationsByType("pharmacy");
  return organizations.map((organization) => ({ slug: organization.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const organization = await loadOrganizationForType(slug, "pharmacy");
  return organizationProfileMetadata(organization);
}

export default async function PharmacyProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const organization = await loadOrganizationForType(slug, "pharmacy");
  return <OrganizationProfileView organization={organization} />;
}
