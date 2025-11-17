import Link from "next/link";

import type { DocNavItem } from "@/lib/sanity/zod";

type DocSidebarProps = {
  items: DocNavItem[];
  currentSlug?: string;
  className?: string;
};

export function DocSidebar({ items, currentSlug, className }: DocSidebarProps) {
  if (!items?.length) return null;
  const grouped = groupByCategory(items);

  return (
    <aside className={className}>
      <nav className="space-y-6">
        {grouped.map(([category, docs]) => (
          <section key={category ?? "uncategorized"}>
            {category && (
              <h3 className="text-muted-foreground text-sm font-semibold uppercase">
                {category}
              </h3>
            )}
            <ul className="mt-3 space-y-1">
              {docs.map((doc) => {
                const isActive = currentSlug === doc.slug.current;
                return (
                  <li key={doc._id}>
                    <Link
                      href={`/docs/${doc.slug.current}`}
                      className={`block rounded-md px-2 py-1 text-sm ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {doc.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </nav>
    </aside>
  );
}

function groupByCategory(items: DocNavItem[]): [string | null, DocNavItem[]][] {
  const map = new Map<string | null, DocNavItem[]>();
  items.forEach((item) => {
    const key = item.category ?? null;
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(item);
  });

  return Array.from(map.entries()).map(([category, docs]) => [
    category,
    docs.sort(
      (a, b) =>
        (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title),
    ),
  ]);
}
