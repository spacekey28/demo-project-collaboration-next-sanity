import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

/**
 * Estimate reading time from plain text content.
 * Roughly 200 words per minute, minimum 1 minute for any non-empty text.
 */
export function calculateReadingTime(text: string | null | undefined): number {
  if (!text) return 0;
  const words = text
    .replace(/<[^>]+>/g, " ") // strip any HTML just in case
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return 0;
  const minutes = Math.ceil(words.length / 200);
  return Math.max(1, minutes);
}
