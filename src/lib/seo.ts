import type { Metadata } from "next";

export type BuildMetadataInput = {
  title?: string;
  description?: string;
  url?: string; // absolute URL of the page
  image?: string; // path or absolute URL to OG image
  siteName?: string;
};

/**
 * Build base Metadata object for Next.js routes.
 * Falls back gracefully if some fields are missing.
 */
export function buildMetadata(input: BuildMetadataInput = {}): Metadata {
  const {
    title = "",
    description = "",
    url = "",
    image = "/opengraph-image.jpg",
    siteName = title || "",
  } = input;

  const absoluteImage = image?.startsWith("http")
    ? image
    : image
      ? `${url?.replace(/\/$/, "")}${image.startsWith("/") ? image : `/${image}`}`
      : undefined;

  return {
    title,
    description,
    alternates: url ? { canonical: url } : undefined,
    openGraph: buildOpenGraph({
      title,
      description,
      url,
      image: absoluteImage,
      siteName,
    }),
    twitter: buildTwitter({ title, description, image: absoluteImage }),
  } satisfies Metadata;
}

export function buildOpenGraph(
  input: BuildMetadataInput = {},
): Metadata["openGraph"] {
  const {
    title = "",
    description = "",
    url = "",
    image,
    siteName = title || "",
  } = input;
  return {
    type: "website",
    url: url || undefined,
    title: title || undefined,
    description: description || undefined,
    siteName: siteName || undefined,
    images: image ? [image] : undefined,
  };
}

export function buildTwitter(
  input: BuildMetadataInput = {},
): Metadata["twitter"] {
  const { title = "", description = "", image } = input;
  return {
    card: "summary_large_image",
    title: title || undefined,
    description: description || undefined,
    images: image ? [image] : undefined,
  };
}
