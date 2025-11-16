import type { Metadata } from "next";

import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { Section } from "@/components/common/section";
import { client } from "@/lib/sanity/client";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { siteSettingsSchema } from "@/lib/sanity/zod";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: "Learn more about our team and mission.",
});

export default async function AboutPage() {
  const settingsData = await client.fetch(siteSettingsQuery);
  const settingsParsed = siteSettingsSchema.safeParse(settingsData);
  const siteTitle = settingsParsed.success
    ? settingsParsed.data.siteTitle
    : "Next Starter";

  return (
    <>
      <Header />
      <main>
        <Section
          title={`About ${siteTitle}`}
          description="We build tools that help teams collaborate and move faster."
        >
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              Our mission is to empower teams to work together, communicate
              clearly, and ship value faster. We believe in simplicity,
              accessibility, and thoughtful design.
            </p>
            <p>
              This site demonstrates a modern, CMS-driven marketing stack
              powered by Next.js and Sanity.
            </p>
          </div>
        </Section>

        <Section
          title="Our Team"
          description="A small, focused group of builders."
        >
          <ul className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            <li className="rounded-lg border p-5">
              <div className="mb-1 text-lg font-semibold">Alex Taylor</div>
              <div className="text-muted-foreground text-sm">
                Product & Design
              </div>
            </li>
            <li className="rounded-lg border p-5">
              <div className="mb-1 text-lg font-semibold">Jordan Smith</div>
              <div className="text-muted-foreground text-sm">Engineering</div>
            </li>
            <li className="rounded-lg border p-5">
              <div className="mb-1 text-lg font-semibold">Riley Chen</div>
              <div className="text-muted-foreground text-sm">
                Customer Success
              </div>
            </li>
          </ul>
        </Section>
      </main>
      <Footer />
    </>
  );
}
