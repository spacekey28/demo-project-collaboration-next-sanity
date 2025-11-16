import { Section } from "@/components/common/section";
import { HeroClient } from "@/components/marketing/hero.client";
import { client } from "@/lib/sanity/client";
import { homePageHeroQuery } from "@/lib/sanity/queries";
import { type HomePage, homePageSchema } from "@/lib/sanity/zod";

async function getHome(): Promise<HomePage | null> {
  try {
    const data = await client.fetch(homePageHeroQuery);
    const parsed = homePageSchema.safeParse(data);
    if (!parsed.success) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

export default async function Hero() {
  const home = await getHome();
  const title = home?.heroTitle ?? "Work Together, Flow Better.";
  const subtitle =
    home?.heroSubtitle ??
    "Flowspace helps teams collaborate, manage projects, and communicate effortlessly — all in one place.";
  const cta = home?.cta ?? "Get Started";

  return (
    <Section>
      <HeroClient title={title} subtitle={subtitle} cta={cta} />
    </Section>
  );
}
