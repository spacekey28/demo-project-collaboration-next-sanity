import type { Metadata } from "next";
import Link from "next/link";
import type { PortableTextBlock } from "sanity";

import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { Section } from "@/components/common/section";
import { client } from "@/lib/sanity/client";
import { allDocPagesQuery } from "@/lib/sanity/queries";
import { type DocPage, docPageSchema } from "@/lib/sanity/zod";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Docs",
  description:
    "Guides, tutorials, and API references for the Flowspace platform.",
});

export default async function DocsIndexPage() {
  const rawPages = await client.fetch(allDocPagesQuery);
  const pages: DocPage[] = (Array.isArray(rawPages) ? rawPages : [])
    .map((item) => docPageSchema.safeParse(item))
    .filter(
      (result): result is { success: true; data: DocPage } => result.success,
    )
    .map((result) => result.data);

  const grouped = groupByCategory(pages);

  return (
    <>
      <Header />
      <main>
        <Section
          title="Documentation"
          description="Find guides, tutorials, and references to help you implement Flowspace."
        >
          <div className="grid gap-8 md:grid-cols-2">
            {grouped.map(([category, docs]) => (
              <div
                key={category ?? "general"}
                className="rounded-xl border p-6 shadow-sm"
              >
                <h2 className="text-lg font-semibold">
                  {category ?? "General"}
                </h2>
                <ul className="mt-4 space-y-3 text-sm">
                  {docs.map((doc) => (
                    <li key={doc._id} className="flex flex-col gap-1">
                      <Link
                        href={`/docs/${doc.slug.current}`}
                        className="text-foreground font-medium hover:underline"
                      >
                        {doc.title}
                      </Link>
                      {doc.content && (
                        <p className="text-muted-foreground line-clamp-2 text-sm">
                          {getPreviewSnippet(doc.content as DocPortableValue)}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}

function groupByCategory(pages: DocPage[]): [string | null, DocPage[]][] {
  const map = new Map<string | null, DocPage[]>();
  pages.forEach((page) => {
    const key = page.category ?? null;
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(page);
  });

  return Array.from(map.entries()).map(([category, docs]) => [
    category,
    docs.sort(
      (a, b) =>
        (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title),
    ),
  ]);
}

type DocPortableValue = PortableTextBlock[];
type DocPortableChild = PortableTextBlock["children"] extends
  | (infer U)[]
  | undefined
  ? U
  : never;

function getPreviewSnippet(
  blocks: DocPortableValue | null | undefined,
): string {
  if (!blocks?.length) return "";
  for (const block of blocks) {
    if (block._type === "block") {
      const text = flattenPortableChildren(block.children);
      if (text) return text.slice(0, 120);
    }
  }
  return "";
}

function flattenPortableChildren(
  children: PortableTextBlock["children"] | undefined,
): string {
  if (!children) return "";
  return (children as DocPortableChild[])
    .map((child) => {
      if (child && typeof child === "object" && "text" in child) {
        const value = (child as { text?: unknown }).text;
        return typeof value === "string" ? value : "";
      }
      return "";
    })
    .join("")
    .trim();
}
