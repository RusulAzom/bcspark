// src/components/blog/BlogCard.tsx
"use client";

import Link from "next/link";
import { Category, getCategoryBreadcrumbs } from "@/lib/blog-helpers";
import { Calendar, Eye, ChevronRight } from "lucide-react";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  categoryIds: string[];
  status: "published" | "draft";
  views: number;
  createdAt: any;
  updatedAt?: any;
  // Rich-Text fields (added by the Tiptap editor). `contentHtml` is the
  // sanitized, renderable HTML; `contentJson` is the editor JSON kept for
  // future editing. `content` is the legacy markdown field kept for backward
  // compatibility with posts created before the rich-text editor existed.
  contentHtml?: string;
  contentJson?: any;
}

interface BlogCardProps {
  post: BlogPost;
  flatCategories: Category[];
}

export default function BlogCard({ post, flatCategories }: BlogCardProps) {
  // Get primary category ID (last item selected)
  const primaryCategoryId = post.categoryIds && post.categoryIds.length > 0
    ? post.categoryIds[post.categoryIds.length - 1]
    : null;

  // Build breadcrumbs for primary category
  const breadcrumbs = getCategoryBreadcrumbs(primaryCategoryId, flatCategories);

  // Convert firebase timestamp / date to formatted string (Bengali)
  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("bn-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col h-full group">
      {/* Cover Image Container */}
      <Link href={`/blog/${post.slug}`} className="block relative aspect-video overflow-hidden bg-gray-100">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-300 font-semibold text-lg">
            BCSpark Blog
          </div>
        )}
      </Link>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Category Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <div className="flex items-center flex-wrap gap-1 text-xs text-gray-500 mb-2.5">
            {breadcrumbs.map((crumb, idx) => (
              <span key={crumb.id} className="flex items-center gap-1">
                {idx > 0 && <ChevronRight className="h-3 w-3 text-gray-300" />}
                <Link
                  href={`/blog/category/${crumb.slug}`}
                  className="hover:text-blue-600 transition-colors font-medium"
                >
                  {crumb.name}
                </Link>
              </span>
            ))}
          </div>
        )}

        {/* Blog Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>

        {/* Blog Excerpt */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
          {post.excerpt || "কোনো সংক্ষিপ্ত বিবরণ নেই।"}
        </p>

        {/* Card Footer Info */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-xs text-gray-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-gray-400" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5 text-gray-400" />
            <span>{post.views || 0} বার পঠিত</span>
          </div>
        </div>
      </div>
    </article>
  );
}
