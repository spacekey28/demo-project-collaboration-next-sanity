import Link from "next/link";

import { client } from "@/lib/sanity/client";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { type SiteSettings, siteSettingsSchema } from "@/lib/sanity/zod";
import { cn } from "@/lib/utils";

export type FooterProps = {
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

export default async function Footer({ className }: FooterProps) {
  const settings = await getSiteSettings();
  const year = new Date().getFullYear();

  return (
    <footer className={cn("border-t py-6", className)}>
      <div className="text-muted-foreground container flex flex-col items-center justify-between gap-2 text-center text-sm md:flex-row md:text-left">
        <p>
          © {year} {settings?.siteTitle ?? "next-starter"}. All rights
          reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
