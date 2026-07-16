import type { Metadata } from "next";
import {
  ProviderProfileView,
  loadProviderForCategory,
} from "@/components/providers/provider-profile-view";
import { getProvidersByCategory } from "@/lib/data";
import { providerProfileMetadata } from "@/lib/seo/page-metadata";

export async function generateStaticParams() {
  const providers = await getProvidersByCategory("psychologist");
  return providers.map((provider) => ({ slug: provider.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const provider = await loadProviderForCategory(slug, "psychologist");
  return providerProfileMetadata(provider);
}

export default async function PsychologistProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const provider = await loadProviderForCategory(slug, "psychologist");
  return <ProviderProfileView provider={provider} />;
}
