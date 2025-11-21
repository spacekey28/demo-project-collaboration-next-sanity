import type { Metadata } from "next";
import Link from "next/link";
import type { PortableTextBlock } from "sanity";

import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { Section } from "@/components/common/section";
import { DocSearch } from "@/components/docs/doc-search";
import { client } from "@/lib/sanity/client";
import { allDocPagesQuery, docsSearchQuery } from "@/lib/sanity/queries";
import { type DocPage, docPageSchema } from "@/lib/sanity/zod";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Docs",
  description:
    "Guides, tutorials, and API references for the Flowspace platform.",
});

type DocsPageProps = {
  searchParams?: {
    search?: string;
  };
};

export default async function DocsIndexPage({ searchParams }: DocsPageProps) {
  const searchTerm = searchParams?.search?.trim() || null;

  // Fetch pages - if searching, fetch search results; otherwise fetch all
  const pages = searchTerm
    ? await fetchSearchResults(searchTerm)
    : await fetchAllPages();

  // For search component, always fetch all pages for client-side filtering
  const allPagesForSearch = searchTerm ? await fetchAllPages() : pages;

  const grouped = searchTerm ? null : groupByCategory(pages);

  return (
    <>
      <Header />
      <main>
        <Section
          title="Documentation"
          description="Find guides, tutorials, and references to help you implement Flowspace."
        >
          <div className="mb-6">
            <DocSearch
              docs={
                Array.isArray(allPagesForSearch)
                  ? allPagesForSearch
                      .map((item: unknown) => docPageSchema.safeParse(item))
                      .filter(
                        (result): result is { success: true; data: DocPage } =>
                          result.success,
                      )
                      .map((result) => result.data)
                  : pages
              }
            />
          </div>

          {searchTerm ? (
            <div>
              <h2 className="mb-4 text-lg font-semibold">
                Search Results for &quot;{searchTerm}&quot;
              </h2>
              {pages.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {pages.map((doc) => (
                    <Link
                      key={doc._id}
                      href={`/docs/${doc.slug.current}`}
                      className="flex flex-col gap-1 rounded-xl border p-4 shadow-sm transition hover:shadow-md"
                    >
                      <div className="text-foreground font-medium">
                        {doc.title}
                      </div>
                      {doc.category && (
                        <div className="text-muted-foreground text-xs">
                          {doc.category}
                        </div>
                      )}
                      {doc.content && (
                        <p className="text-muted-foreground line-clamp-2 text-sm">
                          {getPreviewSnippet(doc.content as DocPortableValue)}
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center">
                  No documentation found matching your search. Try a different
                  query.
                </p>
              )}
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {grouped?.map(([category, docs]) => (
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
          )}
        </Section>
      </main>
      <Footer />
    </>
  );
}

async function fetchAllPages(): Promise<DocPage[]> {
  const rawPages = await client.fetch(allDocPagesQuery);
  return (Array.isArray(rawPages) ? rawPages : [])
    .map((item) => docPageSchema.safeParse(item))
    .filter(
      (result): result is { success: true; data: DocPage } => result.success,
    )
    .map((result) => result.data);
}

async function fetchSearchResults(searchTerm: string): Promise<DocPage[]> {
  const searchQuery = `*${searchTerm}*`; // GROQ match uses wildcards
  const rawPages = await client.fetch<unknown[]>(
    docsSearchQuery as string,
    { searchTerm: searchQuery } as Record<string, unknown>,
  );
  return (Array.isArray(rawPages) ? rawPages : [])
    .map((item) => docPageSchema.safeParse(item))
    .filter(
      (result): result is { success: true; data: DocPage } => result.success,
    )
    .map((result) => result.data);
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
