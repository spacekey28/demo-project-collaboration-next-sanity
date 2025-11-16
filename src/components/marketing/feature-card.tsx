import type { LucideIcon } from "lucide-react";
import * as Lucide from "lucide-react";

import { cn } from "@/lib/utils";

export type FeatureCardProps = {
  className?: string;
  title: string;
  description: string;
  icon?: string | null;
};

function FeatureIcon({ name }: { name?: string | null }) {
  const iconMap = Lucide as unknown as Record<string, LucideIcon>;
  const Icon: LucideIcon = name
    ? (iconMap[capitalize(name)] ?? Lucide.Sparkles)
    : Lucide.Sparkles;
  return (
    <div className="bg-primary/10 text-primary mb-3 inline-flex h-10 w-10 items-center justify-center rounded-md">
      <Icon className="h-5 w-5" aria-hidden />
    </div>
  );
}

function capitalize(input: string) {
  if (!input) return "";
  // Accept kebab-case or lowerCase icon names (e.g., "users", "shield-alert") and convert to PascalCase
  return input
    .split(/[\s-_]+/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

export function FeatureCard({
  className,
  title,
  description,
  icon,
}: FeatureCardProps) {
  return (
    <div className={cn("rounded-lg border p-5", className)}>
      <FeatureIcon name={icon ?? undefined} />
      <h3 className="mb-1 text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
