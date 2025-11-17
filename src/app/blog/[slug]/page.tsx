import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { PortableTextBlock } from "sanity";

import { AuthorBio } from "@/components/blog/author-bio";
import { PortableTextRenderer } from "@/components/blog/portable-text-renderer";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { Section } from "@/components/common/section";
import { client } from "@/lib/sanity/client";
import { blogPostBySlugQuery } from "@/lib/sanity/queries";
import {
  type BlogPostWithAuthor,
  blogPostWithAuthorSchema,
} from "@/lib/sanity/zod";
import { buildMetadata } from "@/lib/seo";
import { calculateReadingTime } from "@/lib/utils";

type BlogPostPageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await fetchPost(params.slug);
  if (!post) {
    return buildMetadata({ title: "Blog" });
  }

  return buildMetadata({
    title: post.title,
    description:
      post.excerpt ??
      `Read ${post.title} by ${post.author?.name ?? "Flowspace"}.`,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await fetchPost(params.slug);
  if (!post) {
    notFound();
  }

  const portableContent = Array.isArray(post.content)
    ? (post.content as PortableTextBlock[])
    : [];
  const readingTime = calculateReadingTime(
    portableTextToPlainText(portableContent),
  );

  return (
    <>
      <Header />
      <main>
        <Section>
          <article className="mx-auto max-w-3xl space-y-6">
            <div className="space-y-3 text-center">
              <p className="text-muted-foreground text-sm tracking-wide uppercase">
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString()
                  : "Draft"}{" "}
                • {readingTime || 1} min read
              </p>
              <h1 className="text-4xl font-bold tracking-tight">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-muted-foreground text-lg">{post.excerpt}</p>
              )}
            </div>

            {portableContent.length > 0 && (
              <PortableTextRenderer value={portableContent} />
            )}

            {post.author && <AuthorBio author={post.author} />}
          </article>
        </Section>
      </main>
      <Footer />
    </>
  );
}

async function fetchPost(slug: string): Promise<BlogPostWithAuthor | null> {
  const data = await client.fetch(blogPostBySlugQuery, { slug });
  const parsed = blogPostWithAuthorSchema.safeParse(data);
  if (parsed.success) {
    return parsed.data;
  }
  return null;
}

function portableTextToPlainText(blocks: PortableTextBlock[]): string {
  return blocks
    .map((block) => {
      if (!Array.isArray(block.children)) {
        return "";
      }
      return (
        block.children
          .map((child) => {
            if (
              typeof child === "object" &&
              "text" in child &&
              typeof child.text === "string"
            ) {
              return child.text;
            }
            return "";
          })
          .join("") ?? ""
      );
    })
    .filter(Boolean)
    .join("\n\n");
}
