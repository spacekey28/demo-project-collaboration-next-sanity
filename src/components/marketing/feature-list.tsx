import { ReactNode } from "react";

import { type Feature, featureSchema } from "@/lib/sanity/zod";
import { cn } from "@/lib/utils";

export type FeatureListProps = {
  className?: string;
  items: unknown[]; // validate at runtime to Feature[]
  renderIcon?: (feature: Feature) => ReactNode;
};

export function FeatureList({
  className,
  items,
  renderIcon,
}: FeatureListProps) {
  const features: Feature[] = [];
  for (const it of items || []) {
    const parsed = featureSchema.safeParse(it);
    if (parsed.success) features.push(parsed.data);
  }

  return (
    <div className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-3", className)}>
      {features.map((f) => (
        <div key={f._id} className="rounded-lg border p-5">
          {renderIcon && <div className="mb-2">{renderIcon(f)}</div>}
          <h3 className="mb-1 text-lg font-semibold">{f.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {f.description}
          </p>
        </div>
      ))}
    </div>
  );
}
