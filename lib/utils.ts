import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractFileKey(fileUrl: string): string | null {
  const match = fileUrl.match(/\/f\/([^/]+)/);
  return match ? match[1] : null;
}

export function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

// utils/deepEqual.ts
export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (
    typeof a !== "object" ||
    a === null ||
    typeof b !== "object" ||
    b === null
  )
    return false;

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) return false;

  for (const key of aKeys) {
    if (!bKeys.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
}

export function getDifferences<T extends Record<string, any>>(
  current: T,
  initial: T
): Partial<T> {
  const diff: Partial<T> = {};

  for (const key in current) {
    if (!Object.prototype.hasOwnProperty.call(initial, key)) continue;

    const currValue = current[key];
    const initValue = initial[key];

    if (!deepEqual(currValue, initValue)) {
      diff[key] = currValue;
    }
  }

  return diff;
}
