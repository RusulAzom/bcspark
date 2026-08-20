// src/app/admin/blog/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BlogPost } from "@/components/blog/BlogCard";
import { Loader2, Plus, Edit, Trash2, Eye, FileText, CheckCircle, Search } from "lucide-react";

export default function AdminBlogListPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const items: BlogPost[] = snapshot.docs.map((docEl) => {
        const data = docEl.data();
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
      setBlogs(items);
    } catch (e) {
      console.error("Error fetching blogs: ", e);
      toast.error("ব্লগ পোস্টগুলো লোড করতে ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`আপনি কি নিশ্চিতভাবে "${title}" ব্লগ পোস্টটি ডিলিট করতে চান?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, "blogs", id));
      toast.success("ব্লগ পোস্ট ডিলিট সম্পন্ন হয়েছে");
      fetchBlogs();
    } catch (err) {
      console.error("Delete failed: ", err);
      toast.error("ডিলিট করার সময় সমস্যা হয়েছে");
    }
  };

  // Local filtering
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("bn-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
        <p className="text-sm text-gray-500 font-medium font-sans">ব্লগ পোস্ট লিস্ট লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ব্লগ পোস্টসমূহ</h1>
          <p className="text-sm text-gray-500">আপনার তৈরি ও ড্রাফটকৃত সকল ব্লগ এখানে ম্যানেজ করুন</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-colors shrink-0"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>নতুন ব্লগ লিখুন</span>
        </Link>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {/* Search filter bar */}
        <div className="p-4 sm:p-5 bg-gray-50/50 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="relative w-full sm:max-w-xs">
            <input
              type="text"
              placeholder="শিরোনাম দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white transition-colors"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <div className="text-xs font-semibold text-gray-500">
            মোট ব্লগ: {filteredBlogs.length}
          </div>
        </div>

        {/* Content Table */}
        <div className="overflow-x-auto min-h-[300px]">
          {filteredBlogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
              <FileText className="h-10 w-10 text-gray-300 mb-2" />
              <p className="text-sm">কোনো ব্লগ পোস্ট পাওয়া যায়নি।</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/30">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    কভার ইমেজ ও শিরোনাম
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    স্ট্যাটাস
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    পাঠক সংখ্যা
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    তারিখ
                  </th>
                  <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider pr-8">
                    অ্যাকশন
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50/40 transition-colors">
                    {/* Cover & Title */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-20 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                          {blog.coverImage ? (
                            <img
                              src={blog.coverImage}
                              alt={blog.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 font-semibold bg-gray-50">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/blog/${blog.slug}`}
                            className="font-bold text-gray-900 hover:text-blue-600 transition-colors block text-sm sm:text-base line-clamp-1"
                            target="_blank"
                          >
                            {blog.title}
                          </Link>
                          <span className="text-xs text-gray-400 font-mono mt-0.5 block truncate">
                            /{blog.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {blog.status === "published" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                          <CheckCircle className="h-3 w-3" />
                          <span>Published</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700">
                          <FileText className="h-3 w-3" />
                          <span>Draft</span>
                        </span>
                      )}
                    </td>

                    {/* Views */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-gray-400" />
                        <span>{blog.views}</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(blog.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium pr-8">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => router.push(`/admin/blog/edit/${blog.id}`)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="সম্পাদনা"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(blog.id, blog.title)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="ডিলিট"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
