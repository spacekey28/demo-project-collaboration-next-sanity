import type { Metadata } from "next";

import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { Section } from "@/components/common/section";
import { PricingTable } from "@/components/marketing/pricing-table";
import { client } from "@/lib/sanity/client";
import { allPricingTiersQuery } from "@/lib/sanity/queries";
import { type PricingTier, pricingTierSchema } from "@/lib/sanity/zod";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Pricing",
  description: "Flexible plans for teams of all sizes.",
});

export default async function PricingPage() {
  const tiers = await client.fetch(allPricingTiersQuery);
  const safeTiers: PricingTier[] = (Array.isArray(tiers) ? tiers : [])
    .map((t) => pricingTierSchema.safeParse(t))
    .filter((r): r is { success: true; data: PricingTier } => r.success)
    .map((r) => r.data);

  return (
    <>
      <Header />
      <main>
        <Section
          title="Pricing"
          description="Flexible plans to get your team moving."
        >
          <PricingToggle tiers={safeTiers} />
        </Section>
      </main>
      <Footer />
    </>
  );
}

// Client toggle wrapper
("use client");

import { useState } from "react";

import { Button } from "@/components/ui/button";

function PricingToggle({ tiers }: { tiers: PricingTier[] }) {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  return (
    <div className="space-y-6">
      <div className="inline-flex items-center gap-2 rounded-md border p-1">
        <Button
          variant={billing === "monthly" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setBilling("monthly")}
        >
          Monthly
        </Button>
        <Button
          variant={billing === "yearly" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setBilling("yearly")}
        >
          Yearly
        </Button>
      </div>
      <PricingTable tiers={tiers} billingCycle={billing} />
    </div>
  );
}
