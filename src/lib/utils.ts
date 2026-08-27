import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a date string safely — return "" if the date is invalid instead of "Invalid Date". */
export function safeFormatDate(
  date: string | undefined,
  options: Intl.DateTimeFormatOptions,
  locale = "en-US"
): string {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString(locale, options);
}
