import type { Metadata } from "next";
import { HeartPulse, Languages, MapPinned, ShieldCheck } from "lucide-react";
import { PageBreadcrumbs } from "@/components/shared/page-breadcrumbs";
import { SITE_NAME } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Turkish Health Network UK — a community-maintained, open-source directory of Turkish-speaking healthcare across the United Kingdom.",
};

const VALUES = [
  {
    icon: Languages,
    title: "Language first",
    description:
      "Every listing records the languages spoken, so patients can find care they can describe their symptoms in.",
  },
  {
    icon: ShieldCheck,
    title: "NHS and private, clearly labelled",
    description:
      "We show whether a provider is NHS, private, or both, along with which insurers and cash plans they accept.",
  },
  {
    icon: MapPinned,
    title: "Built for the whole UK",
    description:
      "Starting in North London's Turkish-speaking communities, and growing to cover cities across the UK.",
  },
  {
    icon: HeartPulse,
    title: "Open source, community maintained",
    description:
      "The directory is a public good. Anyone can suggest corrections, additions, or new categories.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <PageBreadcrumbs items={[{ label: "About" }]} />
      <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        About {SITE_NAME}
      </h1>
      <p className="text-muted-foreground mt-4">
        {SITE_NAME} helps Turkish-speaking people across the UK find
        healthcare providers who speak their language — doctors,
        dentists, psychologists, physiotherapists, dietitians, clinics,
        hospitals and pharmacies — whether they need NHS or private care.
      </p>
      <p className="text-muted-foreground mt-4">
        Navigating a new healthcare system is hard enough without a language
        barrier. A short consultation can turn into a confusing, stressful
        experience when a patient can&apos;t fully explain their symptoms or
        understand their treatment. This directory exists to close that gap:
        every listing records the languages a provider speaks, whether they see
        NHS or private patients, which insurers they accept, and practical
        details like opening hours and accessibility.
      </p>

      <dl className="mt-10 grid gap-6 sm:grid-cols-2">
        {VALUES.map(({ icon: Icon, title, description }) => (
          <div key={title} className="border-border rounded-lg border p-4">
            <dt className="flex items-center gap-2 font-semibold">
              <Icon className="text-primary size-5" aria-hidden="true" />
              {title}
            </dt>
            <dd className="text-muted-foreground mt-2 text-sm">
              {description}
            </dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-10 text-lg font-semibold">Get involved</h2>
      <p className="text-muted-foreground mt-2">
        {SITE_NAME} is open source. The full roadmap includes a database-backed
        admin panel, verified reviews, appointment booking, and support for more
        languages and communities — contributions and corrections are welcome on
        GitHub.
      </p>
    </div>
  );
}
