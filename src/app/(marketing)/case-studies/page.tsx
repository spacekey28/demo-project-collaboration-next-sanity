import type { Metadata } from "next";

import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { Section } from "@/components/common/section";
import { CaseStudyCard } from "@/components/marketing/case-study-card";
import { client } from "@/lib/sanity/client";
import { allCaseStudiesQuery } from "@/lib/sanity/queries";
import { type CaseStudy, caseStudySchema } from "@/lib/sanity/zod";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Case Studies",
  description:
    "Success stories from teams using Flowspace to collaborate better.",
});

export default async function CaseStudiesPage() {
  const raw = await client.fetch(allCaseStudiesQuery);
  const caseStudies: CaseStudy[] = (Array.isArray(raw) ? raw : [])
    .map((item) => caseStudySchema.safeParse(item))
    .filter(
      (result): result is { success: true; data: CaseStudy } => result.success,
    )
    .map((result) => result.data);

  return (
    <>
      <Header />
      <main>
        <Section
          title="Case Studies"
          description="See how Flowspace helps high-performing teams deliver results."
        >
          <div className="grid gap-6 md:grid-cols-2">
            {caseStudies.map((study) => (
              <CaseStudyCard key={study._id} caseStudy={study} />
            ))}
          </div>
          {caseStudies.length === 0 && (
            <p className="text-muted-foreground text-center">
              No case studies published yet.
            </p>
          )}
        </Section>
      </main>
      <Footer />
    </>
  );
}
