import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind + conditional class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Simple number formatter (optional helper)
 */
export function formatNumber(n: number, locales: string | string[] = "en") {
  return new Intl.NumberFormat(locales).format(n);
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}