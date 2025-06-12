import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractFileKey(fileUrl: string): string | null {
  const match = fileUrl.match(/\/f\/([^/]+)/);
  return match ? match[1] : null;
}
