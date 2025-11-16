import { urlFor } from "@/lib/sanity/client";

export type OgImageOptions = {
  width?: number;
  height?: number;
  fit?: "clip" | "crop" | "fill" | "fillmax" | "max" | "scale" | "min";
  quality?: number; // 1-100
  format?: "jpg" | "png" | "webp" | "auto";
};

/**
 * Build an Open Graph image URL from a Sanity image source.
 * Defaults to 1200x630 (recommended OG dimensions).
 */
export function buildOgImageUrl(
  source: unknown,
  options: OgImageOptions = {},
): string | undefined {
  if (!source) return undefined;
  const {
    width = 1200,
    height = 630,
    fit = "crop",
    quality = 85,
    format = "auto",
  } = options;

  try {
    let builder = urlFor(source)
      .width(width)
      .height(height)
      .fit(fit)
      .quality(quality);
    if (format === "jpg") builder = builder.format("jpg");
    if (format === "png") builder = builder.format("png");
    if (format === "webp") builder = builder.format("webp");
    return builder.url();
  } catch {
    return undefined;
  }
}

/**
 * Convenience helper for blog posts.
 */
export function buildPostOgImage(source: unknown): string | undefined {
  return buildOgImageUrl(source, { width: 1200, height: 630, fit: "crop" });
}
