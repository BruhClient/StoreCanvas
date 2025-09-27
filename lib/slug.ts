// Converts "My Store" → "my-store"
export function toSlug(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/[^\w-]/g, ""); // Remove any non-word characters except dash
}

// Converts "my-store" → "My Store"
export function fromSlug(slug: string): string {
  return slug
    .split("-") // Split by dash
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(" "); // Join with spaces
}
