"use client";

import { useState } from "react";

import { PricingTable } from "@/components/marketing/pricing-table";
import { Button } from "@/components/ui/button";
import type { PricingTier } from "@/lib/sanity/zod";

export function PricingToggle({ tiers }: { tiers: PricingTier[] }) {
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
