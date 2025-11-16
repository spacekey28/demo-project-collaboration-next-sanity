import Link from "next/link";

import { Button } from "@/components/ui/button";
import { type PricingTier } from "@/lib/sanity/zod";
import { cn } from "@/lib/utils";

export type PricingTableProps = {
  className?: string;
  tiers: PricingTier[];
  billingCycle?: "monthly" | "yearly";
};

function formatCurrency(value: number) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `$${value}`;
  }
}

export function PricingTable({
  className,
  tiers,
  billingCycle = "monthly",
}: PricingTableProps) {
  const sorted = [...tiers].sort((a, b) => a.monthlyPrice - b.monthlyPrice);

  return (
    <div className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-3", className)}>
      {sorted.map((t) => {
        const price =
          billingCycle === "monthly" ? t.monthlyPrice : t.yearlyPrice;
        const priceSuffix = billingCycle === "monthly" ? "/month" : "/year";
        return (
          <div
            key={t._id}
            className={cn(
              "rounded-lg border p-6",
              t.popular && "border-primary",
            )}
          >
            {t.popular && (
              <div className="bg-primary/10 text-primary mb-2 inline-block rounded px-2 py-1 text-xs font-medium">
                Popular
              </div>
            )}
            <h3 className="mb-1 text-lg font-semibold">{t.name}</h3>
            <div className="mb-4">
              <span className="text-3xl font-extrabold">
                {formatCurrency(price)}
              </span>
              <span className="text-muted-foreground ml-1 text-sm">
                {priceSuffix}
              </span>
            </div>
            <ul className="text-muted-foreground mb-4 space-y-2 text-sm">
              {t.features?.map((f, i) => (
                <li key={i} className="leading-relaxed">
                  {f}
                </li>
              ))}
            </ul>
            <Button asChild className="w-full cursor-pointer">
              <Link href="#">{t.buttonLabel || "Get Started"}</Link>
            </Button>
          </div>
        );
      })}
    </div>
  );
}
