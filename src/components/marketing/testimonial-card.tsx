import { Star } from "lucide-react";
import Image from "next/image";

import { urlFor } from "@/lib/sanity/client";
import { cn } from "@/lib/utils";

export type TestimonialCardProps = {
  className?: string;
  name: string;
  company: string;
  quote: string;
  avatar?: unknown;
  rating?: number | null;
};

function Stars({ rating = 0 }: { rating?: number | null }) {
  const r = Math.max(0, Math.min(5, Math.round(rating || 0)));
  return (
    <div
      className="mb-2 flex items-center gap-0.5"
      aria-label={r ? `${r} out of 5 stars` : undefined}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < r
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground/40",
          )}
        />
      ))}
    </div>
  );
}

export function TestimonialCard({
  className,
  name,
  company,
  quote,
  avatar,
  rating,
}: TestimonialCardProps) {
  const avatarUrl = avatar
    ? urlFor(avatar)?.width(64).height(64).fit("crop").url()
    : undefined;

  return (
    <figure className={cn("rounded-lg border p-5", className)}>
      <blockquote className="text-foreground mb-3 leading-relaxed">
        “{quote}”
      </blockquote>
      <figcaption className="flex items-center gap-3">
        <div className="overflow-hidden rounded-full">
          {avatarUrl ? (
            <Image src={avatarUrl} alt={name} width={40} height={40} />
          ) : (
            <div className="bg-muted h-10 w-10 rounded-full" />
          )}
        </div>
        <div className="text-sm">
          <div className="font-medium">{name}</div>
          <div className="text-muted-foreground">{company}</div>
          {typeof rating === "number" && <Stars rating={rating} />}
        </div>
      </figcaption>
    </figure>
  );
}
