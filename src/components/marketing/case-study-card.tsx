import Image from "next/image";

import { urlFor } from "@/lib/sanity/client";
import type { CaseStudy } from "@/lib/sanity/zod";

type CaseStudyCardProps = {
  caseStudy: CaseStudy;
};

export function CaseStudyCard({ caseStudy }: CaseStudyCardProps) {
  const logo = caseStudy.logo
    ? urlFor(caseStudy.logo)?.width(120).height(60).fit("max").url()
    : null;
  const image = caseStudy.image
    ? urlFor(caseStudy.image)?.width(800).height(500).fit("crop").url()
    : null;

  return (
    <article className="rounded-2xl border p-6 shadow-sm">
      {logo && (
        <div className="mb-4 h-10 w-24">
          <Image
            src={logo}
            alt={caseStudy.client}
            width={120}
            height={60}
            className="h-full w-auto object-contain"
          />
        </div>
      )}
      <h3 className="text-xl font-semibold">{caseStudy.title}</h3>
      <p className="text-muted-foreground mt-2 text-sm">{caseStudy.summary}</p>
      {image && (
        <div className="my-4 overflow-hidden rounded-xl">
          <Image
            src={image}
            alt={caseStudy.title}
            width={800}
            height={400}
            className="h-48 w-full object-cover"
          />
        </div>
      )}
      {caseStudy.outcomes && (
        <dl className="grid gap-3 md:grid-cols-2">
          {caseStudy.outcomes.map((outcome) => (
            <div key={outcome.metric} className="rounded-lg border p-3 text-sm">
              <dt className="text-muted-foreground">{outcome.metric}</dt>
              <dd className="text-lg font-semibold">{outcome.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  );
}
