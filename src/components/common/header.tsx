import Link from "next/link";

import { client } from "@/lib/sanity/client";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { type SiteSettings, siteSettingsSchema } from "@/lib/sanity/zod";
import { cn } from "@/lib/utils";

export type HeaderProps = {
  className?: string;
};

async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const data = await client.fetch(siteSettingsQuery);
    const parsed = siteSettingsSchema.safeParse(data);
    if (!parsed.success) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

export default async function Header({ className }: HeaderProps) {
  const settings = await getSiteSettings();
  const navLinks = settings?.navLinks ?? [];

  return (
    <header className={cn("w-full border-b", className)}>
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-mono text-lg font-bold">
          {settings?.siteTitle ?? "next-starter"}
        </Link>
        <nav className="hidden gap-6 md:flex">
          {navLinks?.map((link) => {
            const href = link?.href || "#";
            const label = link?.label || "";
            return (
              <Link
                key={`${label}-${href}`}
                href={href}
                className="text-foreground/80 hover:text-foreground text-sm"
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
