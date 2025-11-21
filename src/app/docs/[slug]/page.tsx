import {
  PortableText,
  type PortableTextReactComponents,
} from "@portabletext/react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Children, type ReactNode } from "react";
import type { PortableTextBlock } from "sanity";

import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { Section } from "@/components/common/section";
import { Breadcrumb } from "@/components/docs/breadcrumb";
import { DocSidebar } from "@/components/docs/doc-sidebar";
import {
  TableOfContents,
  type TocHeading,
} from "@/components/docs/table-of-contents";
import { getClient, isPreviewMode } from "@/lib/sanity/client";
import { docNavigationQuery, docPageBySlugQuery } from "@/lib/sanity/queries";
import {
  type DocNavItem,
  docNavItemSchema,
  type DocPage,
  docPageSchema,
} from "@/lib/sanity/zod";
import { buildMetadata } from "@/lib/seo";

type DocPageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({
  params,
}: DocPageProps): Promise<Metadata> {
  const doc = await fetchDoc(params.slug);
  if (!doc) return buildMetadata({ title: "Docs" });
  return buildMetadata({
    title: doc.title,
    description: doc.content
      ? extractPreview(doc.content as PortableTextValue)
      : "Flowspace documentation",
  });
}

export default async function DocPage({ params }: DocPageProps) {
  const preview = await isPreviewMode();
  const sanityClient = await getClient(preview);
  const [doc, navItemsRaw] = await Promise.all([
    fetchDoc(params.slug),
    sanityClient.fetch(docNavigationQuery),
  ]);
  if (!doc) notFound();

  const navItems: DocNavItem[] = (Array.isArray(navItemsRaw) ? navItemsRaw : [])
    .map((item) => docNavItemSchema.safeParse(item))
    .filter(
      (result): result is { success: true; data: DocNavItem } => result.success,
    )
    .map((result) => result.data);
  const portableContent: PortableTextValue = Array.isArray(doc.content)
    ? (doc.content as PortableTextBlock[])
    : [];
  const headings = extractHeadings(portableContent);
  const breadcrumbs = buildBreadcrumbs(doc);

  return (
    <>
      <Header />
      <main>
        <Section>
          <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)_220px]">
            <DocSidebar
              items={navItems}
              currentSlug={doc.slug.current}
              className="hidden lg:block"
            />
            <article className="prose prose-neutral dark:prose-invert max-w-none">
              <Breadcrumb items={breadcrumbs} className="mb-4" />
              <h1 className="mb-4 text-4xl font-bold">{doc.title}</h1>
              <DocContent content={portableContent} headings={headings} />
            </article>
            <TableOfContents headings={headings} className="hidden lg:block" />
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}

async function fetchDoc(slug: string): Promise<DocPage | null> {
  const preview = await isPreviewMode();
  const sanityClient = await getClient(preview);
  const data = await sanityClient.fetch(docPageBySlugQuery, { slug });
  const parsed = docPageSchema.safeParse(data);
  return parsed.success ? parsed.data : null;
}

type PortableTextValue = PortableTextBlock[];
type CodeBlockValue = { code?: string };
type PortableTextChild = PortableTextBlock["children"] extends
  | (infer U)[]
  | undefined
  ? U
  : never;

function DocContent({
  content,
  headings,
}: {
  content: PortableTextValue;
  headings: TocHeading[];
}) {
  let headingIndex = 0;
  const components: PortableTextReactComponents = {
    types: {
      code: ({ value }: { value: CodeBlockValue }) => (
        <pre className="bg-muted text-muted-foreground my-4 overflow-x-auto rounded-lg p-4 text-sm">
          <code>{value.code ?? ""}</code>
        </pre>
      ),
    },
    block: {
      h2: ({ children }: { children?: ReactNode }) => {
        const id =
          headings[headingIndex++]?.id ??
          slugify(flattenReactChildren(children));
        return (
          <h2 id={id} className="mt-8 scroll-mt-24 text-2xl font-semibold">
            {children}
          </h2>
        );
      },
      h3: ({ children }: { children?: ReactNode }) => {
        const id =
          headings[headingIndex++]?.id ??
          slugify(flattenReactChildren(children));
        return (
          <h3 id={id} className="mt-6 scroll-mt-24 text-xl font-semibold">
            {children}
          </h3>
        );
      },
    },
    marks: {},
    list: {},
    listItem: {},
    hardBreak: () => <br />,
    unknownType: () => null,
    unknownMark: ({ children }) => <span>{children}</span>,
    unknownBlockStyle: ({ children }) => <p>{children}</p>,
    unknownList: ({ children }) => <ul>{children}</ul>,
    unknownListItem: ({ children }) => <li>{children}</li>,
  };

  const typedContent = Array.isArray(content) ? content : [];
  return <PortableText value={typedContent} components={components} />;
}

function extractHeadings(blocks: PortableTextValue): TocHeading[] {
  const headings: TocHeading[] = [];
  const idCounts = new Map<string, number>();
  blocks.forEach((block) => {
    if (
      block._type === "block" &&
      (block.style === "h2" || block.style === "h3")
    ) {
      const text = flattenPortableChildren(block.children);
      if (!text) return;
      const baseId = slugify(text);
      const count = idCounts.get(baseId) ?? 0;
      idCounts.set(baseId, count + 1);
      const id = count === 0 ? baseId : `${baseId}-${count}`;
      headings.push({ id, text, level: block.style === "h2" ? 2 : 3 });
    }
  });
  return headings;
}

function flattenPortableChildren(
  children: PortableTextBlock["children"] | undefined,
): string {
  if (!children) return "";
  return (children as PortableTextChild[])
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

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

type BreadcrumbItemData = { label: string; href?: string };

function buildBreadcrumbs(doc: DocPage): BreadcrumbItemData[] {
  const crumbs: BreadcrumbItemData[] = [{ label: "Docs", href: "/docs" }];
  if (doc.parent && "slug" in doc.parent) {
    crumbs.push({
      label: doc.parent.title,
      href: `/docs/${doc.parent.slug.current}`,
    });
  }
  crumbs.push({ label: doc.title, href: `/docs/${doc.slug.current}` });
  return crumbs;
}

function extractPreview(blocks: PortableTextValue): string {
  for (const block of blocks) {
    if (block._type === "block") {
      const text = flattenPortableChildren(block.children);
      if (text) return text;
    }
  }
  return "";
}

function flattenReactChildren(children?: ReactNode): string {
  if (!children) return "";
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child);
      }
      if (
        typeof child === "object" &&
        child &&
        "props" in (child as { props?: { children?: ReactNode } })
      ) {
        return flattenReactChildren(
          (child as { props?: { children?: ReactNode } }).props?.children,
        );
      }
      return "";
    })
    .join("")
    .trim();
}
