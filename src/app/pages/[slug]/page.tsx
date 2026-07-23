import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageBreadcrumbs } from "@/components/shared/page-breadcrumbs";
import { getPublishedPageBySlug, getPublishedPages } from "@/lib/data";
import { pageMetadata } from "@/lib/seo/page-metadata";

export async function generateStaticParams() {
  const pages = await getPublishedPages();
  return pages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublishedPageBySlug(slug);
  if (!page) return {};
  return pageMetadata(page);
}

export default async function CmsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPublishedPageBySlug(slug);
  if (!page) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <PageBreadcrumbs items={[{ label: page.title }]} />
      <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        {page.title}
      </h1>
      <div
        className="[&_a]:text-primary mt-6 [&_a]:underline [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:font-semibold [&_li]:mt-1 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:text-muted-foreground [&_p]:mt-4 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5"
        // Body is admin-authored rich text from the Directus Data Studio,
        // not user-submitted content — safe to render as HTML.
        dangerouslySetInnerHTML={{ __html: page.body }}
      />
    </div>
  );
}
