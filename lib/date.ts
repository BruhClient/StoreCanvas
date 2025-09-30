import { format } from "date-fns";

/**
 * Format a date into "6 January 2025"
 * @param date Date | string | number
 * @returns formatted date string
 */
export function formatLongDate(date: Date | string | number): string {
  const parsedDate =
    typeof date === "string" || typeof date === "number"
      ? new Date(date)
      : date;

  return format(parsedDate, "d MMMM yyyy");
}
