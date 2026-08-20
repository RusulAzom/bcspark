// src/app/blog/category/[categorySlug]/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Metadata } from "next";
import Link from "next/link";
import { collection, query, where, getDocs, limit, orderBy } from "firebase/firestore";
import { ChevronRight, FolderOpen, ArrowLeft, BookOpen, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/lib/firebase";
import { Category, getCategoryBreadcrumbs, getAllChildCategoryIds } from "@/lib/blog-helpers";
import BlogCard, { BlogPost } from "@/components/blog/BlogCard";

interface CategoryArchivePageProps {
  params: Promise<{ categorySlug: string }>;
}

// Fetch single category by slug
async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  if (!slug) return null;
  try {
    const q = query(collection(db, "categories"), where("slug", "==", slug), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const docEl = snap.docs[0];
    const data = docEl.data();
    return {
      id: docEl.id,
      name: data.name,
      slug: data.slug,
      parentId: data.parentId || null,
      level: data.level || 1,
    } as Category;
  } catch (err) {
    console.error("Error fetching category by slug:", err);
    return null;
  }
}

// Fetch all categories
async function fetchAllCategories(): Promise<Category[]> {
  try {
    const snap = await getDocs(query(collection(db, "categories"), orderBy("createdAt", "asc")));
    return snap.docs.map((docEl) => {
      const data = docEl.data();
      return {
        id: docEl.id,
        name: data.name,
        slug: data.slug,
        parentId: data.parentId || null,
        level: data.level || 1,
      };
    });
  } catch (err) {
    console.error("Error loading categories:", err);
    return [];
  }
}

// Fetch blogs belonging recursively to any of these category IDs
async function fetchBlogsByCategories(categoryIds: string[]): Promise<BlogPost[]> {
  if (categoryIds.length === 0) return [];
  try {
    // Note: array-contains-any limits us to 10 elements in firestore.
    // If the category tree has more than 10 categories, we can chunk it or filter client-side.
    // Since recursive categories are generally small (under 10 subcategories), array-contains-any works.
    // We fetch newest first.
    const q = query(
      collection(db, "blogs"),
      where("status", "==", "published"),
      where("categoryIds", "array-contains-any", categoryIds.slice(0, 10)),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((docEl) => {
      const data = docEl.data();
      return {
        id: docEl.id,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage,
        categoryIds: data.categoryIds || [],
        status: data.status,
        views: data.views || 0,
        createdAt: data.createdAt,
      } as BlogPost;
    });
  } catch (err) {
    console.error("Error fetching blogs for categories:", err);
    return [];
  }
}

// Generate SEO metadata dynamically for Category Archives
export async function generateMetadata({ params }: CategoryArchivePageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = await fetchCategoryBySlug(categorySlug);
  if (!category) {
    return {
      title: "Category Not Found | BCS Spark",
    };
  }

  const seoTitle = `${category.name} আর্কাইভ | BCS Spark Blog`;
  const seoDescription = `BCS Spark ব্লগে ${category.name} সম্পর্কিত সকল গুরুত্বপূর্ণ পোস্ট ও টিউটোরিয়াল পড়ুন।`;

  return {
    title: seoTitle,
    description: seoDescription,
  };
}

export default async function CategoryArchivePage({ params }: CategoryArchivePageProps) {
  const { categorySlug } = await params;
  const category = await fetchCategoryBySlug(categorySlug);

  if (!category) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[60vh] flex-col items-center justify-center bg-gray-50 px-4 font-sans">
          <AlertCircle className="h-10 w-10 text-red-500 mb-3" />
          <h1 className="text-2xl font-bold text-gray-900">ক্যাটাগরি পাওয়া যায়নি</h1>
          <p className="mt-2 text-gray-600 text-center">
            আপনি যে ক্যাটাগরি আর্কাইভটি খুঁজছেন তা ডিলিট করা হয়েছে অথবা লিংকটি ভুল।
          </p>
          <Link
            href="/blog"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 shadow"
          >
            <ArrowLeft className="h-4 w-4" />
            ব্লগে ফিরে যান
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  // 1. Load all categories to evaluate children & breadcrumbs
  const flatCategories = await fetchAllCategories();
  const breadcrumbs = getCategoryBreadcrumbs(category.id, flatCategories);

  // 2. Identify recursive category IDs (current + all descendants)
  const allSubCategoryIds = getAllChildCategoryIds(category.id, flatCategories);

  // 3. Fetch blogs matching recursive categories
  const blogs = await fetchBlogsByCategories(allSubCategoryIds);

  // 4. Identify direct subcategories for rendering top tags
  const directSubcategories = flatCategories.filter((c) => c.parentId === category.id);

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-brand-bg py-8 font-sans">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Breadcrumbs and back navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 font-semibold transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              <span>সব ব্লগ তালিকা</span>
            </Link>

            {breadcrumbs.length > 0 && (
              <div className="flex items-center flex-wrap gap-1 text-gray-500">
                <span className="hover:text-blue-600">
                  <Link href="/blog">ব্লগ</Link>
                </span>
                {breadcrumbs.map((crumb) => (
                  <span key={crumb.id} className="flex items-center gap-1">
                    <ChevronRight className="h-3 w-3 text-gray-300 shrink-0" />
                    <Link
                      href={`/blog/category/${crumb.slug}`}
                      className={`font-medium truncate max-w-[120px] ${
                        crumb.id === category.id ? "text-blue-600 font-bold" : "hover:text-blue-600"
                      }`}
                    >
                      {crumb.name}
                    </Link>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Category Banner Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <FolderOpen className="h-6 w-6" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {category.name} আর্কাইভ
              </h1>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
              &quot;{category.name}&quot; ক্যাটাগরি ও তার অধীনে থাকা সকল সাব-ক্যাটাগরির সর্বমোট {blogs.length}টি পোস্ট নিচে দেখানো হলো।
            </p>

            {/* Subcategories list tags */}
            {directSubcategories.length > 0 && (
              <div className="pt-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">সাব-ক্যাটাগরি সমূহ</h3>
                <div className="flex flex-wrap gap-2">
                  {directSubcategories.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/blog/category/${sub.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded-full border border-gray-100 transition-colors"
                    >
                      <span>{sub.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Blogs Grid */}
          <div className="space-y-6">
            {blogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm text-gray-400">
                <BookOpen className="h-10 w-10 text-gray-300 mb-2" />
                <p className="text-sm font-semibold text-gray-700">কোনো ব্লগ পাওয়া যায়নি</p>
                <p className="text-xs text-gray-400 mt-1">এই ক্যাটাগরিতে এখনো কোনো ব্লগ পাবলিশ করা হয়নি।</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {blogs.map((post) => (
                  <BlogCard key={post.id} post={post} flatCategories={flatCategories} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
