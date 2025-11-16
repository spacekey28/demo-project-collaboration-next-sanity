import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { Section } from "@/components/common/section";
import { FeatureCard } from "@/components/marketing/feature-card";
import Hero from "@/components/marketing/hero";
import Integrations from "@/components/marketing/integrations";
import { TestimonialCard } from "@/components/marketing/testimonial-card";
import { client } from "@/lib/sanity/client";
import {
  featuredFeaturesQuery,
  featuredTestimonialsQuery,
} from "@/lib/sanity/queries";
import {
  type Feature,
  featureSchema,
  type Testimonial,
  testimonialSchema,
} from "@/lib/sanity/zod";

export default async function HomePage() {
  const features = await client.fetch(featuredFeaturesQuery);
  const testimonials = await client.fetch(featuredTestimonialsQuery);

  const safeFeatures: Feature[] = (Array.isArray(features) ? features : [])
    .map((f) => featureSchema.safeParse(f))
    .filter((r): r is { success: true; data: Feature } => r.success)
    .map((r) => r.data);

  const safeTestimonials: Testimonial[] = (
    Array.isArray(testimonials) ? testimonials : []
  )
    .map((t) => testimonialSchema.safeParse(t))
    .filter((r): r is { success: true; data: Testimonial } => r.success)
    .map((r) => r.data);

  return (
    <>
      <Header />
      <main>
        <Hero />

        <Section
          title="Features"
          description="A few highlights from the platform."
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

        <Section title="What customers say" description="Trusted by teams.">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {safeTestimonials.map((t) => (
              <TestimonialCard
                key={t._id}
                name={t.name}
                company={t.company}
                quote={t.quote}
                avatar={t.avatar}
                rating={t.rating ?? null}
              />
            ))}
          </div>
        </Section>

        <Integrations
          items={[
            { name: "Sanity" },
            { name: "Next.js" },
            { name: "Vercel" },
            { name: "Stripe" },
            { name: "GitHub" },
            { name: "Radix" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
