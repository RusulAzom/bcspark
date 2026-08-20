// src/app/blog/page.tsx
"use client";

import { useEffect, useState, useTransition } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogCard, { BlogPost } from "@/components/blog/BlogCard";
import CategoryTree from "@/components/blog/CategoryTree";
import { Category, buildCategoryTree, getAllChildCategoryIds } from "@/lib/blog-helpers";
import { toast } from "sonner";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  startAt,
  endAt,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, Search, FilterX, ChevronLeft, ChevronRight } from "lucide-react";

export default function BlogListingPage() {
  // Navigation & Data lists
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryTree, setCategoryTree] = useState<Category[]>([]);

  // Filtering states
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Loading & Pagination
  const [loading, setLoading] = useState(true);
  const [categoryCounts, setCategoryCounts] = useState<{ [id: string]: number }>({});
  const [isPending, startTransition] = useTransition();

  // Firestore pagination
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageHistory, setPageHistory] = useState<any[]>([]);

  // Dataset modes
  const [isSmallDataset, setIsSmallDataset] = useState(true); // default true, checked on load
  const [allPublishedBlogs, setAllPublishedBlogs] = useState<BlogPost[]>([]);

  // 1. Debounce Search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setCurrentPage(1);
      setPageHistory([]);
      setLastDoc(null);
    }, 450);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // 2. Initial Setup: Load all categories & counts, check dataset size
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        // Fetch Categories
        const catSnap = await getDocs(query(collection(db, "categories"), orderBy("createdAt", "asc")));
        const catList: Category[] = catSnap.docs.map((docEl) => {
          const data = docEl.data() as any;
          return {
            id: docEl.id,
            name: data.name,
            slug: data.slug,
            parentId: data.parentId || null,
            level: data.level || 1,
          };
        });
        setCategories(catList);
        setCategoryTree(buildCategoryTree(catList));

        // Fetch ALL published blogs to check if dataset < 200
        const allBlogsSnap = await getDocs(
          query(collection(db, "blogs"), where("status", "==", "published"), orderBy("createdAt", "desc"))
        );

        const allBlogsList: BlogPost[] = allBlogsSnap.docs.map((docEl) => {
          const data = docEl.data() as any;
          return {
            id: docEl.id,
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            content: data.content,
            coverImage: data.coverImage,
            categoryIds: data.categoryIds || [],
            status: data.status || "draft",
            views: data.views || 0,
            createdAt: data.createdAt,
          };
        });

        setAllPublishedBlogs(allBlogsList);

        // Determine mode based on size (< 200 is small)
        const isSmall = allBlogsList.length < 200;
        setIsSmallDataset(isSmall);

        // Pre-calculate category counts recursively
        const counts: { [id: string]: number } = {};
        catList.forEach((cat) => {
          const childIds = getAllChildCategoryIds(cat.id, catList);
          const matchCount = allBlogsList.filter((blog) =>
            blog.categoryIds.some((cid) => childIds.includes(cid))
          ).length;
          counts[cat.id] = matchCount;
        });
        setCategoryCounts(counts);
      } catch (err) {
        console.error("Failed to load initial blog data:", err);
        toast.error("ব্লগ তথ্য লোড করতে ত্রুটি হয়েছে");
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // 3. Load & Filter Blogs (Runs when filters change)
  useEffect(() => {
    if (loading) return;

    const loadFilteredBlogs = async () => {
      // If dataset is small, apply in-memory filters
      if (isSmallDataset) {
        let list = [...allPublishedBlogs];

        // Filter by category recursively
        if (selectedCategoryId) {
          const childIds = getAllChildCategoryIds(selectedCategoryId, categories);
          list = list.filter((blog) => blog.categoryIds.some((cid) => childIds.includes(cid)));
        }

        // Substring case-insensitive search
        if (debouncedSearch) {
          list = list.filter((blog) =>
            blog.title.toLowerCase().includes(debouncedSearch.toLowerCase())
          );
        }

        // Handle client-side pagination
        const itemsPerPage = 10;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const pageItems = list.slice(startIndex, startIndex + itemsPerPage);

        setBlogs(pageItems);
        setHasMore(list.length > startIndex + itemsPerPage);
        return;
      }

      // If dataset >= 200, use Firestore pagination & queries
      try {
        let q;
        const itemsPerPage = 10;

        if (debouncedSearch) {
          // Firestore prefix search (must order by title)
          q = query(
            collection(db, "blogs"),
            where("status", "==", "published"),
            orderBy("title"),
            startAt(debouncedSearch),
            endAt(debouncedSearch + "\uf8ff"),
            limit(itemsPerPage)
          );
        } else if (selectedCategoryId) {
          // Filter by categories (includes recursive children)
          const childIds = getAllChildCategoryIds(selectedCategoryId, categories);
          q = query(
            collection(db, "blogs"),
            where("status", "==", "published"),
            where("categoryIds", "array-contains-any", childIds),
            orderBy("createdAt", "desc"),
            limit(itemsPerPage)
          );
        } else {
          // Standard latest posts query
          q = query(
            collection(db, "blogs"),
            where("status", "==", "published"),
            orderBy("createdAt", "desc"),
            limit(itemsPerPage)
          );
        }

        // Apply cursor pagination
        if (currentPage > 1 && lastDoc) {
          q = query(q, startAfter(lastDoc));
        }

        const snap = await getDocs(q);
        const list: BlogPost[] = snap.docs.map((docEl) => {
          const data = docEl.data() as any;
          return {
            id: docEl.id,
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            content: data.content,
            coverImage: data.coverImage,
            categoryIds: data.categoryIds || [],
            status: data.status || "draft",
            views: data.views || 0,
            createdAt: data.createdAt,
          };
        });

        setBlogs(list);
        setLastDoc(snap.docs[snap.docs.length - 1] || null);

        // Check if there are more items
        setHasMore(snap.docs.length === itemsPerPage);
      } catch (err) {
        console.error("Firestore loading error: ", err);
        toast.error("ফিল্টারকৃত ব্লগ লোড করা যায়নি");
      }
    };

    startTransition(() => {
      loadFilteredBlogs();
    });
  }, [selectedCategoryId, debouncedSearch, currentPage, isSmallDataset, allPublishedBlogs]);

  // Handle Category Filter Click
  const handleSelectCategory = (id: string | null) => {
    setSelectedCategoryId(id);
    setCurrentPage(1);
    setPageHistory([]);
    setLastDoc(null);
  };

  // Pagination triggers
  const handleNextPage = () => {
    if (!hasMore) return;
    if (!isSmallDataset && lastDoc) {
      setPageHistory((prev) => [...prev, lastDoc]);
    }
    setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage <= 1) return;
    if (!isSmallDataset) {
      const history = [...pageHistory];
      history.pop(); // Remove current last doc
      setPageHistory(history);
      setLastDoc(history[history.length - 1] || null);
    }
    setCurrentPage((prev) => prev - 1);
  };

  // Reset all filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategoryId(null);
    setCurrentPage(1);
    setPageHistory([]);
    setLastDoc(null);
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-brand-bg py-8 min-h-[60vh] font-sans">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Header Panel */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">BCS Spark ব্লগ</h1>
              <p className="text-sm text-gray-500">
                বিসিএস প্রিলিমিনারি ও লিখিত প্রস্তুতি সহজ করতে তৈরি আমাদের তথ্যবহুল ব্লগ সমূহ
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:max-w-sm">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ব্লগ পোস্ট খুঁজুন..."
                className="w-full pl-11 pr-4 py-2.5 text-sm rounded-full border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none bg-gray-50/50 focus:bg-white transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Main Grid: Sidebar filter on left + Blogs on right */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* Left Column: Collapsible Category Tree */}
            <aside className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">ক্যাটাগরি সমূহ</h2>
                {(selectedCategoryId || searchQuery) && (
                  <button
                    onClick={handleClearFilters}
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline font-semibold"
                  >
                    ফিল্টার মুছুন
                  </button>
                )}
              </div>

              {loading ? (
                <div className="flex justify-center py-6">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                </div>
              ) : (
                <div className="space-y-1">
                  <button
                    onClick={() => handleSelectCategory(null)}
                    className={`w-full text-left py-1.5 px-3 rounded-lg text-sm transition-colors font-medium ${
                      selectedCategoryId === null
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    সব ব্লগ ({allPublishedBlogs.length})
                  </button>
                  <CategoryTree
                    categories={categoryTree}
                    selectedCategoryId={selectedCategoryId}
                    onSelectCategory={handleSelectCategory}
                    categoryCounts={categoryCounts}
                  />
                </div>
              )}
            </aside>

            {/* Right Column: Blogs Output list */}
            <section className="lg:col-span-3 space-y-6">
              {loading || isPending ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
                  <p className="text-sm text-gray-500 font-medium">ব্লগ লোড হচ্ছে...</p>
                </div>
              ) : blogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm text-gray-400">
                  <FilterX className="h-12 w-12 text-gray-300 mb-3" />
                  <p className="text-base font-semibold text-gray-800 mb-1">কোনো ব্লগ পাওয়া যায়নি</p>
                  <p className="text-xs text-gray-500 mb-4">ভিন্ন শব্দ লিখে ট্রাই করুন অথবা ফিল্টার পরিবর্তন করুন।</p>
                  <button
                    onClick={handleClearFilters}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl text-xs transition"
                  >
                    সব ব্লগ দেখান
                  </button>
                </div>
              ) : (
                <>
                  {/* Blog Cards Grid */}
                  <div className="grid gap-6 sm:grid-cols-2">
                    {blogs.map((post) => (
                      <BlogCard key={post.id} post={post} flatCategories={categories} />
                    ))}
                  </div>

                  {/* Pagination Section */}
                  {(currentPage > 1 || hasMore) && (
                    <div className="flex items-center justify-center gap-4 pt-6 border-t border-gray-100">
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage <= 1}
                        className="flex items-center gap-1 bg-white hover:bg-gray-50 disabled:bg-gray-100 text-gray-700 font-bold py-2.5 px-4 rounded-xl border border-gray-200 text-xs transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>পূর্ববর্তী</span>
                      </button>
                      <span className="text-xs font-semibold text-gray-500">
                        পৃষ্ঠা: {currentPage}
                      </span>
                      <button
                        onClick={handleNextPage}
                        disabled={!hasMore}
                        className="flex items-center gap-1 bg-white hover:bg-gray-50 disabled:bg-gray-100 text-gray-700 font-bold py-2.5 px-4 rounded-xl border border-gray-200 text-xs transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>পরবর্তী</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
