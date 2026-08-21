// src/app/blog/[slug]/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Metadata } from "next";
import Link from "next/link";
import { collection, query, where, getDocs, doc, updateDoc, increment, limit, orderBy } from "firebase/firestore";
import ReactMarkdown from "react-markdown";
import { Calendar, Eye, ArrowLeft, ChevronRight, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/lib/firebase";
import { Category, getCategoryBreadcrumbs } from "@/lib/blog-helpers";
import { sanitizeHtml } from "@/lib/sanitize";
import { BlogPost } from "@/components/blog/BlogCard";

interface BlogDetailsPageProps {
  params: Promise<{ slug: string }>;
}

// Fetch Blog post helper
async function fetchBlogPost(slug: string): Promise<BlogPost | null> {
  if (!slug) return null;
  try {
    const q = query(collection(db, "blogs"), where("slug", "==", slug), where("status", "==", "published"), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const docEl = snap.docs[0];
    const data = docEl.data();
    return {
      id: docEl.id,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      contentHtml: data.contentHtml,
      contentJson: data.contentJson,
      coverImage: data.coverImage,
      categoryIds: data.categoryIds || [],
      status: data.status || "published",
      views: data.views || 0,
      createdAt: data.createdAt,
    } as BlogPost;
  } catch (err) {
    console.error("Error fetching blog post by slug:", err);
    return null;
  }
}

// Fetch Categories Helper
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

// Fetch Related Blogs Helper
async function fetchRelatedBlogs(categoryId: string, currentBlogId: string): Promise<BlogPost[]> {
  try {
    const q = query(
      collection(db, "blogs"),
      where("status", "==", "published"),
      where("categoryIds", "array-contains", categoryId),
      limit(4)
    );
    const snap = await getDocs(q);
    const list: BlogPost[] = [];
    snap.docs.forEach((docEl) => {
      if (docEl.id !== currentBlogId && list.length < 3) {
        const data = docEl.data();
        list.push({
          id: docEl.id,
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          coverImage: data.coverImage,
          categoryIds: data.categoryIds || [],
          status: data.status,
          views: data.views || 0,
          createdAt: data.createdAt,
        } as BlogPost);
      }
    });
    return list;
  } catch (err) {
    console.error("Error loading related blogs: ", err);
    return [];
  }
}

// Next.js Dynamic SEO Metadata Generator
export async function generateMetadata({ params }: BlogDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);
  if (!post) {
    return {
      title: "Blog Not Found | BCS Spark",
    };
  }

  const seoTitle = `${post.title} | BCS Spark Blog`;
  const seoDescription = post.excerpt || `${post.title} সম্পর্কে বিস্তারিত জানুন BCS Spark ব্লগে।`;

  const ogImages = post.coverImage ? [{ url: post.coverImage }] : undefined;

  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: "article",
      publishedTime: post.createdAt?.toDate ? post.createdAt.toDate().toISOString() : undefined,
      images: ogImages,
    },
  };
}

export default async function BlogDetailsPage({ params }: BlogDetailsPageProps) {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);

  if (!post) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[60vh] flex-col items-center justify-center bg-gray-50 px-4 font-sans">
          <h1 className="text-2xl font-bold text-gray-900">ব্লগটি পাওয়া যায়</h1>
          <p className="mt-2 text-gray-600 text-center">
            আপনি যে ব্লগ পোস্টটি খুঁজছেন তা মুছে ফেলা হয়েছে অথবা ইউআরএল ভুল।
         </p>
          <Link
            href="/blog"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 shadow"
          >
            <ArrowLeft className="h-4 w-4" />
            সব ব্লগে ফিরে যান
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  // 1. Increment View Count in Firestore
  try {
    const postRef = doc(db, "blogs", post.id);
    await updateDoc(postRef, {
      views: increment(1),
    });
    // Update local variable for rendering correct view count
    post.views += 1;
  } catch (err) {
    console.error("Increment views error:", err);
  }

  // 2. Fetch category lists and build breadcrumbs
  const flatCategories = await fetchAllCategories();
  const primaryCategoryId = post.categoryIds && post.categoryIds.length > 0
    ? post.categoryIds[post.categoryIds.length - 1]
    : null;
  const breadcrumbs = getCategoryBreadcrumbs(primaryCategoryId, flatCategories);

  // 3. Fetch Related posts
  const relatedPosts = primaryCategoryId ? await fetchRelatedBlogs(primaryCategoryId, post.id) : [];

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("bn-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Predefined custom Markdown styled components matching the application
  const markdownComponents = {
    h1: (props: any) => <h1 className="text-2xl sm:text-3xl font-bold mt-6 mb-4 text-gray-900 border-b pb-2" {...props} />,
    h2: (props: any) => <h2 className="text-xl sm:text-2xl font-bold mt-5 mb-3 text-gray-900" {...props} />,
    h3: (props: any) => <h3 className="text-lg sm:text-xl font-semibold mt-4 mb-2 text-gray-900" {...props} />,
    p: (props: any) => <p className="mb-4 text-gray-700 leading-relaxed text-base sm:text-lg" {...props} />,
    ul: (props: any) => <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 text-base sm:text-lg" {...props} />,
    ol: (props: any) => <ol className="list-decimal pl-6 mb-4 space-y-2 text-gray-700 text-base sm:text-lg" {...props} />,
    li: (props: any) => <li className="mb-0.5" {...props} />,
    a: (props: any) => <a className="text-blue-600 hover:underline hover:text-blue-800 font-semibold break-all" target="_blank" rel="noopener noreferrer" {...props} />,
    blockquote: (props: any) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-5 bg-blue-50/50 py-3 pr-2 rounded-r text-base sm:text-lg" {...props} />
    ),
    code: ({ node, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      const isInline = !match;
      return isInline ? (
        <code className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded text-sm font-mono font-semibold" {...props}>
          {children}
        </code>
      ) : (
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-xs sm:text-sm font-mono my-4 shadow-inner">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      );
    },
    table: (props: any) => (
      <div className="overflow-x-auto my-6 rounded-lg border border-gray-100 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200" {...props} />
      </div>
    ),
    th: (props: any) => <th className="bg-gray-50 px-4 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b" {...props} />,
    td: (props: any) => <td className="px-4 py-3 text-sm text-gray-600 border-b" {...props} />,
    img: (props: any) => <img className="rounded-xl max-h-96 mx-auto object-cover my-6 shadow-md" {...props} />,
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-brand-bg py-8 font-sans">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Back navigation & Breadcrumbs */}
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
                      className="hover:text-blue-600 font-medium truncate max-w-[120px]"
                    >
                      {crumb.name}
                    </Link>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Main Article Container */}
          <article className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
            
            {/* Header elements */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                {post.title}
              </h1>

              {/* Excerpt if present */}
              {post.excerpt && (
                <p className="text-gray-600 text-base sm:text-lg border-l-4 border-gray-200 pl-3.5 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              {/* Meta stats */}
              <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-500 border-y border-gray-50 py-3 shrink-0">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>পাবলিশড: {formatDate(post.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="h-4 w-4 text-gray-400" />
                  <span>পঠিত: {post.views} বার</span>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            {post.coverImage && (
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Blog body — rich HTML (primary, sanitized) or legacy markdown fallback */}
            <div className="prose prose-lg max-w-none pt-2 dark:prose-invert">
              {post.contentHtml ? (
                <div
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.contentHtml) }}
                />
              ) : (
                <ReactMarkdown components={markdownComponents}>{post.content}</ReactMarkdown>
              )}
            </div>
          </article>

          {/* Related Articles Panel */}
          {relatedPosts.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <span>সম্পর্কিত অন্যান্য ব্লগ</span>
              </h2>

              <div className="grid gap-6 sm:grid-cols-3">
                {relatedPosts.map((rPost) => (
                  <div
                    key={rPost.id}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      {rPost.coverImage && (
                        <Link href={`/blog/${rPost.slug}`} className="block aspect-video rounded-lg overflow-hidden bg-gray-50 mb-2">
                          <img
                            src={rPost.coverImage}
                            alt={rPost.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </Link>
                      )}
                      <Link
                        href={`/blog/${rPost.slug}`}
                        className="font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 text-sm leading-snug"
                      >
                        {rPost.title}
                      </Link>
                    </div>
                    <span className="text-[10px] text-gray-400 mt-3 block">{formatDate(rPost.createdAt)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
