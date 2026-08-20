// src/app/admin/blog/new/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Category, buildCategoryTree, generateSlug } from "@/lib/blog-helpers";
import MarkdownEditor from "@/components/blog/MarkdownEditor";
import { Loader2, ArrowLeft, Save, Image, Upload } from "lucide-react";

export default function AdminNewBlogPage() {
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [status, setStatus] = useState<"published" | "draft">("draft");

  // Auxiliary states
  const [flatCategories, setFlatCategories] = useState<Category[]>([]);
  const [categoryTree, setCategoryTree] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const q = query(collection(db, "categories"), orderBy("createdAt", "asc"));
        const snap = await getDocs(q);
        const list: Category[] = snap.docs.map((docEl) => {
          const data = docEl.data();
          return {
            id: docEl.id,
            name: data.name,
            slug: data.slug,
            parentId: data.parentId || null,
            level: data.level || 1,
          };
        });
        setFlatCategories(list);
        setCategoryTree(buildCategoryTree(list));
      } catch (err) {
        console.error("Categories fetch error: ", err);
        toast.error("ক্যাটাগরি ডেটা লোড করা যায়নি");
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Sync slug on title change
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    setSlug(generateSlug(val));
  };

  // Image Upload Handler
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!storage) {
      toast.error("ফায়ারবেস স্টোরেজ ইনিশিয়ালাইজ হয়নি। দয়া করে আপনার এনভায়রনমেন্ট ভ্যারিয়েবল চেক করুন।");
      return;
    }

    setImageUploading(true);
    try {
      const timestamp = Date.now();
      const cleanFilename = file.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const storageRef = ref(storage, `blog_covers/${timestamp}_${cleanFilename}`);

      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);
      setCoverImage(downloadUrl);
      toast.success("কভার ইমেজ আপলোড সফল হয়েছে");
    } catch (err) {
      console.error("Storage upload failed: ", err);
      toast.error("কভার ইমেজ আপলোড ব্যর্থ হয়েছে। ফায়ারবেস স্টোরেজ রুলস চেক করুন।");
    } finally {
      setImageUploading(false);
    }
  };

  // Category Multi-Checkbox Selection handler
  const handleCategoryCheckboxChange = (id: string, checked: boolean) => {
    if (checked) {
      // Append to end. Last selected will be considered primary.
      setSelectedCategoryIds((prev) => [...prev.filter((item) => item !== id), id]);
    } else {
      setSelectedCategoryIds((prev) => prev.filter((item) => item !== id));
    }
  };

  // Form Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("ব্লগের শিরোনাম দিন");
      return;
    }

    const finalSlug = slug.trim() ? generateSlug(slug) : generateSlug(title);
    if (!finalSlug) {
      toast.error("একটি সঠিক স্ল্যাগ দিন");
      return;
    }

    if (selectedCategoryIds.length === 0) {
      toast.error("কমপক্ষে ১টি ক্যাটাগরি সিলেক্ট করুন");
      return;
    }

    setSubmitting(true);
    try {
      // Check Slug Uniqueness in Firestore
      const slugQuery = query(collection(db, "blogs"), where("slug", "==", finalSlug));
      const querySnap = await getDocs(slugQuery);
      if (!querySnap.empty) {
        toast.error("এই স্ল্যাগটি (slug) ইতোমধ্যে অন্য ব্লগে ব্যবহৃত হচ্ছে। অনুগ্রহ করে স্ল্যাগ বা শিরোনাম পরিবর্তন করুন।");
        setSubmitting(false);
        return;
      }

      // Add Doc to Firestore
      const docPayload = {
        title: title.trim(),
        slug: finalSlug,
        excerpt: excerpt.trim(),
        content: content.trim(),
        coverImage,
        categoryIds: selectedCategoryIds,
        status,
        views: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, "blogs"), docPayload);
      toast.success("ব্লগ পোস্ট সফলভাবে তৈরি হয়েছে");
      router.push("/admin/blog");
    } catch (err) {
      console.error("Submit blog post error: ", err);
      toast.error("ব্লগ পোস্ট সংরক্ষণ করা যায়নি");
    } finally {
      setSubmitting(false);
    }
  };

  // Checkbox Visual Tree rendering component (Recursive)
  const renderCategoryCheckboxes = (cats: Category[], depth = 0) => {
    return cats.map((cat) => {
      const isChecked = selectedCategoryIds.includes(cat.id);
      const isPrimary = selectedCategoryIds[selectedCategoryIds.length - 1] === cat.id;

      return (
        <div key={cat.id} className="flex flex-col">
          <label
            className={`inline-flex items-center gap-2.5 py-1.5 px-3 rounded-lg cursor-pointer text-sm transition-colors ${
              isChecked ? "bg-blue-50/50 text-blue-700" : "hover:bg-gray-50 text-gray-700"
            }`}
            style={{ marginLeft: `${depth * 20}px` }}
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => handleCategoryCheckboxChange(cat.id, e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <span className="font-medium">{cat.name}</span>
            {isChecked && isPrimary && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-bold shrink-0">
                Primary
              </span>
            )}
          </label>
          {cat.children && cat.children.length > 0 && renderCategoryCheckboxes(cat.children, depth + 1)}
        </div>
      );
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Upper Navigation Header */}
      <div className="pb-5 border-b border-gray-200">
        <button
          onClick={() => router.push("/admin/blog")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 font-semibold mb-2 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>ব্লগ তালিকায় ফিরে যান</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">নতুন ব্লগ পোস্ট তৈরি</h1>
        <p className="text-sm text-gray-500">নতুন একটি ব্লগ লিখে পাবলিশ বা ড্রাফট করুন</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-4">
        {/* Left Side: Main Editor Controls (3 Columns) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Main Title & Slug Box */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                ব্লগ শিরোনাম <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="ব্লগের শিরোনাম লিখুন..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                পোস্ট স্ল্যাগ (URL Path / Slug) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(generateSlug(e.target.value))}
                placeholder="যেমন: nextjs-tutorial-bangla"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                required
              />
              <p className="text-[10px] text-gray-400 mt-1">
                ইউনিক পোস্ট এড্রেস তৈরি হবে: /blog/{"{"}slug{"}"}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                সংক্ষিপ্ত বিবরণ (Excerpt)
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="ব্লগ কার্ডে দেখানোর জন্য একটি ছোট ভূমিকা বা বিবরণ (১৫০ অক্ষরের মধ্যে)..."
                rows={3}
                maxLength={200}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Side-by-side split markdown editor */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider pl-1">
              ব্লগ কনটেন্ট
            </label>
            <MarkdownEditor value={content} onChange={setContent} />
          </div>
        </div>

        {/* Right Side: Options and Publishing Controls (1 Column) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Cover Image Upload Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <h2 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">
              কভার ইমেজ (Cover Image)
            </h2>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50/50 hover:bg-gray-50 transition-colors relative min-h-[140px]">
              {coverImage ? (
                <div className="w-full h-full flex flex-col items-center gap-2">
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-full aspect-video object-cover rounded-lg shadow-sm border border-gray-200"
                  />
                  <label className="text-[10px] font-semibold text-blue-600 hover:underline cursor-pointer">
                    নতুন ইমেজ আপলোড
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : imageUploading ? (
                <div className="flex flex-col items-center justify-center py-6 text-gray-500">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600 mb-2" />
                  <span className="text-xs">আপলোড হচ্ছে...</span>
                </div>
              ) : (
                <label className="w-full h-full flex flex-col items-center justify-center gap-2 cursor-pointer py-4">
                  <div className="p-2 bg-white rounded-full shadow-sm text-gray-400 border">
                    <Upload className="h-5 w-5" />
                  </div>
                  <span className="text-xs text-gray-500 font-semibold text-center">
                    ক্লিক করে ইমেজ দিন
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Category selection tree */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
            <h2 className="text-sm font-bold text-gray-800 border-b border-gray-100 pb-2">
              ক্যাটাগরি সিলেক্ট করুন
            </h2>
            <div className="max-h-[220px] overflow-y-auto pr-1">
              {categoriesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                </div>
              ) : categoryTree.length === 0 ? (
                <p className="text-xs text-gray-400">কোনো ক্যাটাগরি তৈরি করা হয়নি।</p>
              ) : (
                <div className="flex flex-col gap-1">
                  {renderCategoryCheckboxes(categoryTree)}
                </div>
              )}
            </div>
            <p className="text-[10px] text-gray-400 pt-1 border-t border-gray-100">
              * সর্বশেষ সিলেক্ট করা ক্যাটাগরিটি প্রাইমারি হিসেবে গণ্য হবে।
            </p>
          </div>

          {/* Publishing controls */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                স্ট্যাটাস (Status)
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "published" | "draft")}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:outline-none bg-white transition-colors cursor-pointer"
              >
                <option value="draft">খসড়া (Draft)</option>
                <option value="published">পাবলিশ করুন (Published)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-2.5 px-4 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>ব্লগ সংরক্ষণ করুন</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
