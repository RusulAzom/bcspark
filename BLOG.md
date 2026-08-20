# Project: Full Blog System for Next.js + Firebase

## GOAL
Build a complete, production-ready blog system inside the existing Next.js project. This work MUST be done on the current `blog` branch only. Do NOT touch `main` branch.

## TECH STACK RULES
- Framework: Next.js 14+ App Router (already exists)
- Database: Firebase Firestore (already connected)
- Styling: Tailwind CSS (use existing config)
- Editor: Use a FREE and simple editor. DO NOT use paid editor. Use ONE of these:
  Option 1: `react-markdown` + `react-simple-wysiwyg` or simple `textarea` with Markdown support.
  Option 2: `TipTap` headless free version.
  PREFERRED: Simple Textarea with Markdown preview. So user writes markdown and we render it with `react-markdown`. This is most simple, free and lightweight.
- No extra paid dependency.
- Image Upload: Use Firebase Storage.

## DATABASE STRUCTURE (Firestore)

### 1. Collection: `categories`
Fields:
- `id`: auto id
- `name`: string (e.g., Technology)
- `slug`: string (e.g., technology) - unique, lowercase, hyphen
- `parentId`: string | null - If null, it's a top-level category. If has value, it's subcategory of that parent id. This allows unlimited levels.
- `level`: number - 1 for top, 2 for child etc.
- `createdAt`: timestamp

Example:
- Technology (parentId: null, level: 1)
    - Web Development (parentId: Technology_id, level: 2)
        - Next.js (parentId: Web_Development_id, level: 3)

### 2. Collection: `blogs`
Fields:
- `id`: auto id
- `title`: string
- `slug`: string - unique, for URL /blog/[slug]
- `excerpt`: string - short 150 char summary for list page
- `content`: string - markdown content
- `coverImage`: string - Firebase Storage URL
- `categoryIds`: array of strings - Can select multiple categories [id1, id2]. Last selected will be considered primary.
- `status`: string - "published" | "draft"
- `views`: number - default 0
- `createdAt`: timestamp
- `updatedAt`: timestamp

## FEATURES TO BUILD

### A. Public Pages (SEO Friendly)

1.  **`/blog` - Blog Listing Page**
        - Show all published blogs, newest first.
        - Left sidebar / Top filter: Show category tree with multi-level. Clicking a category filters blogs.
        - Category tree should be collapsible. Show count of blogs per category.
        - Search bar to search by title.
        - Pagination (10 per page) using Firestore cursor.
        - Each blog card: coverImage, title, excerpt, category breadcrumbs (e.g., Technology > Web Dev > Next.js), date.

2.  **`/blog/[slug]` - Single Blog Page**
        - Fetch blog by slug.
        - Render markdown content using `react-markdown`.
        - Show breadcrumbs for category hierarchy.
        - Show related blogs from same category.
        - Increment `views` count.
        - SEO: dynamic metadata (title, description).

3.  **`/blog/category/[categorySlug]` - Category Archive Page**
        - Show all blogs under this category AND its child categories (recursive).
        - Show category name, description and child categories.

### B. Admin Pages (Protected if you have auth, else simple route)

Create routes under `/admin/blog`

1.  **`/admin/blog` - List All Blogs**
        - Table of all blogs with edit/delete.

2.  **`/admin/blog/new` and `/admin/blog/edit/[id]` - Blog Editor**
        - Fields: Title (auto-generate slug from title), Excerpt, Cover Image upload with preview, Category selector (multi-select checkbox tree with levels), Markdown Editor (textarea + live preview side-by-side), Status dropdown.
        - On save, save to Firestore.

3.  **`/admin/categories` - Category Manager**
        - Show category tree in a tree view.
        - Add new category: Name, Slug, Select Parent Category (dropdown of all categories with indentation showing level).
        - Edit / Delete category. If delete, if it has children, prevent delete or re-assign children to null.
        - Important: Write a helper function `buildCategoryTree()` and `getAllChildCategoryIds(parentId)` for recursive filtering.

### C. Components to Create

- `components/blog/CategoryTree.jsx` - Reusable recursive component to render categories.
- `components/blog/BlogCard.jsx`
- `components/blog/MarkdownEditor.jsx` - Simple textarea on left, preview on right using react-markdown.
- `lib/blog-helpers.js` - All helper functions: `generateSlug()`, `buildCategoryTree()`, `getCategoryBreadcrumbs()`, `getAllChildCategoryIds()`.

### D. Logic Rules

1.  Slug must be unique. Before saving, check if slug exists.
2.  When fetching blogs for a category, you must fetch all child category IDs recursively. Example: If user clicks "Technology", show blogs that have categoryId = Technology OR Web Development OR Next.js.
3.  Image upload to Firebase Storage path: `blog_covers/{timestamp}_{filename}`
4.  Use `serverTimestamp()` for dates.
5.  Keep existing project design system, colors, fonts.

## WHAT NOT TO DO

- Do not install paid packages.
- Do not create a new Firebase project. Use existing firebase config from `lib/firebase.js` or `firebase.js`.
- Do not modify `main` branch.
- Do not break existing pages.

## FINAL CHECKLIST

- [ ] npm install `react-markdown`
- [ ] Categories CRUD works with unlimited levels
- [ ] Blog CRUD with markdown works
- [ ] /blog page with category filter works recursively
- [ ] /blog/[slug] page works
- [ ] /blog/category/[slug] works
- [ ] Admin pages work
- [ ] No console errors
- [ ] Responsive on mobile