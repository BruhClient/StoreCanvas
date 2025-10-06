import { differenceInHours, differenceInMinutes, format } from "date-fns";

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

export const getDuration = (
  start: string | Date,
  end?: string | Date | null
) => {
  const startedAt = new Date(start);
  const endedAt = end ? new Date(end) : new Date();

  const minutes = differenceInMinutes(endedAt, startedAt);
  if (minutes < 60) {
    return `${minutes} min${minutes !== 1 ? "s" : ""}`;
  }
  const hours = differenceInHours(endedAt, startedAt);
  return `${hours} hr${hours !== 1 ? "s" : ""}`;
};
