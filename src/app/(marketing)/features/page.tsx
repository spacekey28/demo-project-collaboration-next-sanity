import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { Section } from "@/components/common/section";
import { FeatureCard } from "@/components/marketing/feature-card";
import { client } from "@/lib/sanity/client";
import { allFeaturesQuery } from "@/lib/sanity/queries";
import { type Feature, featureSchema } from "@/lib/sanity/zod";

export default async function FeaturesPage() {
  const features = await client.fetch(allFeaturesQuery);
  const safeFeatures: Feature[] = (Array.isArray(features) ? features : [])
    .map((f) => featureSchema.safeParse(f))
    .filter((r): r is { success: true; data: Feature } => r.success)
    .map((r) => r.data);

  return (
    <>
      <Header />
      <main>
        <Section
          title="Features"
          description="Explore what you can do with our platform."
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {safeFeatures.map((f) => (
              <FeatureCard
                key={f._id}
                title={f.title}
                description={f.description}
                icon={f.icon}
              />
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
