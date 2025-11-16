"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export type HeroClientProps = {
  title: string;
  subtitle: string;
  cta?: string | null;
};

export function HeroClient({ title, subtitle, cta }: HeroClientProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-gradient-to-r from-rose-700 to-pink-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-5xl"
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        className="text-muted-foreground mt-3 max-w-2xl md:text-lg"
      >
        {subtitle}
      </motion.p>
      {cta && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="mt-6"
        >
          <Button asChild size="lg" className="cursor-pointer">
            <Link href="/pricing">{cta}</Link>
          </Button>
        </motion.div>
      )}
    </div>
  );
}
