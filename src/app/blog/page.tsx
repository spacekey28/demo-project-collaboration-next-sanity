import type { Metadata } from "next";
import Link from "next/link";

import { BlogCard } from "@/components/blog/blog-card";
import { BlogTags } from "@/components/blog/blog-tags";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { Section } from "@/components/common/section";
import { client } from "@/lib/sanity/client";
import {
  allBlogTagsQuery,
  blogPostCountQuery,
  blogPostsByTagQuery,
  blogPostsPaginatedQuery,
} from "@/lib/sanity/queries";
import {
  type BlogPostWithAuthor,
  blogPostWithAuthorSchema,
} from "@/lib/sanity/zod";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

const POSTS_PER_PAGE = 6;

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description: "Insights, tutorials, and updates from the Flowspace team.",
});

type BlogPageProps = {
  searchParams?: {
    page?: string;
    tag?: string;
  };
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const pageParam = Number(searchParams?.page) || 1;
  const currentPage = Math.max(1, pageParam);
  const tag = searchParams?.tag?.trim() || null;

  const [tags, postsData] = await Promise.all([
    client.fetch(allBlogTagsQuery),
    fetchPosts({ page: currentPage, tag }),
  ]);

  return (
    <>
      <Header />
      <main>
        <Section
          title="Blog"
          description="Product updates, best practices, and guides for building better collaboration."
        >
          <div className="mb-6">
            <BlogTags
              tags={tags ?? []}
              activeTag={tag}
              buildHref={(nextTag) => {
                const params = new URLSearchParams();
                if (nextTag) params.set("tag", nextTag);
                return `/blog${params.size ? `?${params.toString()}` : ""}`;
              }}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {postsData.posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>

          {postsData.totalPages > 1 && (
            <Pagination
              currentPage={postsData.currentPage}
              totalPages={postsData.totalPages}
              activeTag={tag}
            />
          )}

          {postsData.posts.length === 0 && (
            <p className="text-muted-foreground text-center">
              No posts found for this selection. Try a different tag.
            </p>
          )}
        </Section>
      </main>
      <Footer />
    </>
  );
}

async function fetchPosts({
  page,
  tag,
}: {
  page: number;
  tag: string | null;
}): Promise<{
  posts: BlogPostWithAuthor[];
  totalPages: number;
  currentPage: number;
}> {
  if (tag) {
    const raw = await client.fetch<unknown[]>(blogPostsByTagQuery, {
      tag,
    } as Record<string, unknown>);
    const parsed = (Array.isArray(raw) ? raw : []) as unknown[];
    const safePosts = parsed
      .map((post) => blogPostWithAuthorSchema.safeParse(post))
      .filter(
        (result): result is { success: true; data: BlogPostWithAuthor } =>
          result.success,
      )
      .map((result) => result.data);

    const totalPages = Math.max(
      1,
      Math.ceil(safePosts.length / POSTS_PER_PAGE),
    );
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * POSTS_PER_PAGE;
    const posts = safePosts.slice(start, start + POSTS_PER_PAGE);

    return { posts, totalPages, currentPage: safePage };
  }

  const start = (page - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;

  const [rawPosts, totalCount] = await Promise.all([
    client.fetch<unknown[]>(blogPostsPaginatedQuery, { start, end } as Record<
      string,
      unknown
    >),
    client.fetch<number>(blogPostCountQuery),
  ]);

  const posts = (Array.isArray(rawPosts) ? rawPosts : [])
    .map((post) => blogPostWithAuthorSchema.safeParse(post))
    .filter(
      (result): result is { success: true; data: BlogPostWithAuthor } =>
        result.success,
    )
    .map((result) => result.data);

  const totalPages = Math.max(1, Math.ceil((totalCount ?? 0) / POSTS_PER_PAGE));
  const safePage = Math.min(page, totalPages);

  return { posts, totalPages, currentPage: safePage };
}

function Pagination({
  currentPage,
  totalPages,
  activeTag,
}: {
  currentPage: number;
  totalPages: number;
  activeTag: string | null;
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  function buildHref(page: number) {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", String(page));
    if (activeTag) params.set("tag", activeTag);
    const query = params.toString();
    return `/blog${query ? `?${query}` : ""}`;
  }

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
      {pages.map((page) => (
        <Link
          key={page}
          href={buildHref(page)}
          className={cn(
            "rounded-md border px-3 py-1 text-sm",
            page === currentPage && "bg-primary text-primary-foreground",
          )}
        >
          {page}
        </Link>
      ))}
    </div>
  );
}
