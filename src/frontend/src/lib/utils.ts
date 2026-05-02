import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Returns true if the deadline string is within the next 7 days. */
export function isDeadlineSoon(deadline: string): boolean {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const diff = deadlineDate.getTime() - now.getTime();
  const days = diff / (1000 * 60 * 60 * 24);
  return days >= 0 && days <= 7;
}

/** Formats a nanosecond bigint timestamp to a human-readable date string. */
export function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp / 1_000_000n);
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Returns abbreviated text with ellipsis if over max length. */
export function truncate(text: string, max = 100): string {
  return text.length > max ? `${text.slice(0, max)}...` : text;
}
