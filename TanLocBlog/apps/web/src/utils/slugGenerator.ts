// Slug generation utilities for SEO-friendly URLs

/**
 * Generate a URL-friendly slug from text
 * @param text - The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function generateSlug(text: string): string {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')           // Remove special characters except spaces and hyphens
    .replace(/[\s_-]+/g, '-')           // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, '');           // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug by checking against existing slugs
 * @param title - The title to generate slug from
 * @param existingSlugs - Array of existing slugs to check against
 * @returns A unique slug
 */
export async function generateUniqueSlug(title: string, existingSlugs: string[]): Promise<string> {
  let baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 1;
  
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

/**
 * Generate author slug from full name
 * @param fullName - The author's full name
 * @returns A URL-friendly author slug
 */
export function generateAuthorSlug(fullName: string): string {
  return generateSlug(fullName);
}

/**
 * Check if a string is a valid UUID
 * @param str - The string to check
 * @returns True if the string is a valid UUID
 */
export function isUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

// Examples:
// "Top 5 Code Editors for 2024!" → "top-5-code-editors-for-2024"
// "John Doe" → "john-doe"
// "Jane Smith-Wilson" → "jane-smith-wilson"
// "Best React Tutorials!" → "best-react-tutorials"
// isUUID("2f9cbefa-536e-4766-9d1c-eab9004776c1") → true
// isUUID("john-doe") → false
