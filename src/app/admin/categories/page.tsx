// src/app/admin/categories/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Category, buildCategoryTree, generateSlug } from "@/lib/blog-helpers";
import { Loader2, Plus, Edit, Trash2, FolderOpen, ArrowLeft, FolderPlus } from "lucide-react";

export default function AdminCategoriesPage() {
  const { user, loading, role } = useAuth();
  const router = useRouter();

  // Categories flat & tree states
  const [flatCategories, setFlatCategories] = useState<Category[]>([]);
  const [categoryTree, setCategoryTree] = useState<Category[]>([]);
  const [fetching, setFetching] = useState(true);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentId, setParentId] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Auto route check in case Layout wasn't fully mounted
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
    } else if (role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, loading, role, router]);

  const fetchCategories = async () => {
    setFetching(true);
    try {
      const q = query(collection(db, "categories"), orderBy("createdAt", "asc"));
      const querySnapshot = await getDocs(q);
      const items: Category[] = querySnapshot.docs.map((docEl) => {
        const data = docEl.data();
        return {
          id: docEl.id,
          name: data.name,
          slug: data.slug,
          parentId: data.parentId ?? null,
          level: data.level ?? 1,
          createdAt: data.createdAt,
        };
      });

      setFlatCategories(items);
      setCategoryTree(buildCategoryTree(items));
    } catch (e) {
      console.error("Error loading categories: ", e);
      toast.error("ক্যাটাগরি লোড করতে সমস্যা হয়েছে");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (user && role === "admin") {
      fetchCategories();
    }
  }, [user, role]);

  // Sync slug auto-generation from name unless editing
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!editingId) {
      setSlug(generateSlug(val));
    }
  };

  // Submit Handler: Add / Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("ক্যাটাগরির নাম দিন");
      return;
    }

    const finalSlug = slug.trim() ? generateSlug(slug) : generateSlug(name);

    // Ensure slug uniqueness
    const slugCollision = flatCategories.find(
      (c) => c.slug === finalSlug && c.id !== editingId
    );
    if (slugCollision) {
      toast.error("এই স্ল্যাগটি (slug) ইতোমধ্যে অন্য ক্যাটাগরিতে ব্যবহৃত হচ্ছে। অনুগ্রহ করে ভিন্ন নাম/স্ল্যাগ ব্যবহার করুন।");
      return;
    }

    setSubmitting(true);
    try {
      let level = 1;
      const parsedParentId = parentId === "" ? null : parentId;

      if (parsedParentId) {
        const parent = flatCategories.find((c) => c.id === parsedParentId);
        if (parent) {
          level = parent.level + 1;
        }
      }

      // Prevent cyclic parenting (editing parent to be one of its own children/itself)
      if (editingId && parsedParentId) {
        if (editingId === parsedParentId) {
          toast.error("একটি ক্যাটাগরি নিজেই নিজের প্যারেন্ট হতে পারে না");
          setSubmitting(false);
          return;
        }
        // Verify parent is not a child of the current editing category
        let currentParent = flatCategories.find((c) => c.id === parsedParentId);
        while (currentParent) {
          if (currentParent.parentId === editingId) {
            toast.error("কোনো ক্যাটাগরিকে তার সাব-ক্যাটাগরির আন্ডারে নেওয়া যাবে না");
            setSubmitting(false);
            return;
          }
          currentParent = flatCategories.find((c) => c.id === currentParent!.parentId);
        }
      }

      const payload = {
        name: name.trim(),
        slug: finalSlug,
        parentId: parsedParentId,
        level,
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        // Update Firestore Document
        const docRef = doc(db, "categories", editingId);
        await updateDoc(docRef, payload);
        toast.success("ক্যাটাগরি আপডেট সম্পন্ন হয়েছে");
      } else {
        // Add Firestore Document
        const newPayload = {
          ...payload,
          createdAt: serverTimestamp(),
        };
        await addDoc(collection(db, "categories"), newPayload);
        toast.success("নতুন ক্যাটাগরি তৈরি সম্পন্ন হয়েছে");
      }

      // Reset form and reload
      setName("");
      setSlug("");
      setParentId("");
      setEditingId(null);
      await fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("ক্যাটাগরি সংরক্ষণ করা যায়নি");
    } finally {
      setSubmitting(false);
    }
  };

  // Edit action triggers
  const handleEditClick = (cat: Category) => {
    setName(cat.name);
    setSlug(cat.slug);
    setParentId(cat.parentId || "");
    setEditingId(cat.id);
  };

  // Cancel editing mode
  const handleCancelEdit = () => {
    setName("");
    setSlug("");
    setParentId("");
    setEditingId(null);
  };

  // Delete category with children validation
  const handleDeleteClick = async (id: string) => {
    // Check if category has child elements
    const hasChildren = flatCategories.some((c) => c.parentId === id);
    if (hasChildren) {
      toast.error(
        "এই ক্যাটাগরিটির অধীনে সাব-ক্যাটাগরি রয়েছে। আগে সাব-ক্যাটাগরিগুলো মুছে ফেলুন বা অন্য প্যারেন্ট ক্যাটাগরি সিলেক্ট করুন।"
      );
      return;
    }

    if (!confirm("আপনি কি নিশ্চিতভাবে এই ক্যাটাগরি ডিলিট করতে চান?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "categories", id));
      toast.success("ক্যাটাগরি ডিলিট সম্পন্ন হয়েছে");
      await fetchCategories();
    } catch (err) {
      console.error(err);
      toast.error("ডিলিট করার সময় ত্রুটি ঘটেছে");
    }
  };

  // Visual Category Tree Table Row Renderer
  const renderTreeRows = (cats: Category[], depth = 0) => {
    return cats.map((cat) => (
      <div key={cat.id} className="flex flex-col">
        <div className="flex items-center justify-between border-b border-gray-100 hover:bg-gray-50/50 py-3.5 px-4 text-sm transition-colors">
          <div className="flex items-center gap-2 min-w-0" style={{ paddingLeft: `${depth * 24}px` }}>
            <FolderOpen className={`h-4 w-4 shrink-0 ${depth === 0 ? "text-blue-500" : "text-gray-400"}`} />
            {depth > 0 && <span className="text-gray-300 mr-1">|—</span>}
            <span className="font-medium text-gray-900 truncate">{cat.name}</span>
            <span className="text-xs text-gray-400 font-mono">({cat.slug})</span>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-4">
            <button
              onClick={() => handleEditClick(cat)}
              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="সম্পাদনা করুন"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDeleteClick(cat.id)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="ডিলিট করুন"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        {cat.children && cat.children.length > 0 && renderTreeRows(cat.children, depth + 1)}
      </div>
    ));
  };

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500 font-medium">ক্যাটাগরি ডেটা লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gray-200">
        <div>
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 font-semibold mb-2 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>ড্যাশবোর্ডে ফিরে যান</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">ক্যাটাগরি ম্যানেজার</h1>
          <p className="text-sm text-gray-500">ব্লগ পোস্টগুলোর জন্য মাল্টি-লেভেল ক্যাটাগরি তৈরি ও নিয়ন্ত্রণ করুন</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left Side: CRUD Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <FolderPlus className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">
              {editingId ? "ক্যাটাগরি সম্পাদনা" : "নতুন ক্যাটাগরি যোগ করুন"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                নাম (Name) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="যেমন: ওয়েব ডেভেলপমেন্ট"
                value={name}
                onChange={handleNameChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                স্ল্যাগ (Slug)
              </label>
              <input
                type="text"
                placeholder="যেমন: web-development"
                value={slug}
                onChange={(e) => setSlug(generateSlug(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                ইউনিক URL তৈরির জন্য ব্যবহৃত হবে (Bangla ও English সমর্থিত)
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                প্যারেন্ট ক্যাটাগরি (Parent Category)
              </label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white transition-colors"
              >
                <option value="">কোনো প্যারেন্ট নেই (টপ-লেভেল ক্যাটাগরি)</option>
                {flatCategories
                  .filter((c) => c.id !== editingId) // Exclude current editing category from selection
                  .map((cat) => {
                    const indentation = Array(cat.level - 1)
                      .fill("\u00A0\u00A0\u00A0\u00A0")
                      .join("");
                    const prefix = cat.level > 1 ? "└─ " : "";
                    return (
                      <option key={cat.id} value={cat.id}>
                        {indentation}
                        {prefix}
                        {cat.name}
                      </option>
                    );
                  })}
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-2.5 px-4 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 transition"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : editingId ? (
                  <Edit className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                <span>{editingId ? "আপডেট করুন" : "যোগ করুন"}</span>
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm font-semibold text-gray-600 transition"
                >
                  বাতিল
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Side: Tree View List */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between shrink-0">
            <h2 className="text-md font-bold text-gray-800">ক্যাটাগরি লিস্ট (ট্রি-ভিউ)</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold">
              মোট: {flatCategories.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto min-h-[400px]">
            {categoryTree.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <FolderOpen className="h-10 w-10 text-gray-300 mb-2" />
                <p className="text-sm">কোনো ক্যাটাগরি তৈরি করা হয়নি এখনও।</p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-gray-100">
                {renderTreeRows(categoryTree)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
