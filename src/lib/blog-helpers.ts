// src/lib/blog-helpers.ts

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  level: number;
  createdAt?: any;
  children?: Category[];
}

/**
 * Unicode-friendly slug generator supporting Bengali and English characters.
 * Keeps Bangla unicode (\u0980-\u09FF), English letters, and numbers.
 * Replaces spaces with hyphens and removes other symbols.
 * Example: "Next.js শেখা" -> "nextjs-শেখা"
 */
export function generateSlug(title: string): string {
  if (!title) return "";
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\u0980-\u09FFa-z0-9\s-]/g, "") // Keep only Bengali, English lower, numbers, spaces, and hyphens
    .replace(/\s+/g, "-")                    // Replace spaces with single hyphen
    .replace(/-+/g, "-")                     // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, "");                // Trim hyphens from start and end
}

/**
 * Converts a flat array of categories into a nested parent-child tree.
 */
export function buildCategoryTree(flatCategories: Category[]): Category[] {
  const map: { [key: string]: Category & { children: Category[] } } = {};
  const tree: Category[] = [];

  // Step 1: Initialize all categories in the map
  flatCategories.forEach((cat) => {
    map[cat.id] = { ...cat, children: [] };
  });

  // Step 2: Build parent-child relationships
  flatCategories.forEach((cat) => {
    const item = map[cat.id];
    if (cat.parentId) {
      const parent = map[cat.parentId];
      if (parent) {
        parent.children.push(item);
      } else {
        tree.push(item); // Parent not found in flat list, treat as root
      }
    } else {
      tree.push(item);
    }
  });

  return tree;
}

/**
 * Gets breadcrumbs starting from the root parent down to the active category.
 */
export function getCategoryBreadcrumbs(categoryId: string | null, flatCategories: Category[]): Category[] {
  if (!categoryId) return [];
  const breadcrumbs: Category[] = [];
  const map = new Map(flatCategories.map((c) => [c.id, c]));
  let currentId: string | null = categoryId;

  while (currentId) {
    const cat = map.get(currentId);
    if (!cat) break;
    breadcrumbs.unshift(cat); // Prepend to construct top-down order
    currentId = cat.parentId;
  }

  return breadcrumbs;
}

/**
 * Recursively collects all child category IDs (including the parentId itself).
 * Essential for searching blogs belonging to a parent category and all its descendants.
 */
export function getAllChildCategoryIds(parentId: string, flatCategories: Category[]): string[] {
  const ids: string[] = [parentId];

  const traverse = (id: string) => {
    for (const cat of flatCategories) {
      if (cat.parentId === id) {
        ids.push(cat.id);
        traverse(cat.id); // Recursively search descendants
      }
    }
  };

  traverse(parentId);
  return ids;
}

/**
 * Helper to retrieve the primary category (the last category selected in the categoryIds array).
 */
export function getPrimaryCategory(categoryIds: string[] | undefined, flatCategories: Category[]): Category | null {
  if (!categoryIds || categoryIds.length === 0) return null;
  const primaryId = categoryIds[categoryIds.length - 1];
  return flatCategories.find((c) => c.id === primaryId) || null;
}
