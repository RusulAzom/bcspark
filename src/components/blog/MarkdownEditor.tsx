// src/components/blog/MarkdownEditor.tsx
"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Eye, Edit2, Columns } from "lucide-react";

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "split">("split");

  // Custom components to style the markdown components perfectly to match the application's look and feel
  const markdownComponents = {
    h1: (props: any) => <h1 className="text-2xl font-bold mt-5 mb-3 text-gray-900 border-b pb-1.5" {...props} />,
    h2: (props: any) => <h2 className="text-xl font-bold mt-4 mb-2.5 text-gray-900" {...props} />,
    h3: (props: any) => <h3 className="text-lg font-semibold mt-3.5 mb-2 text-gray-900" {...props} />,
    p: (props: any) => <p className="mb-3 text-gray-700 leading-relaxed text-sm sm:text-base" {...props} />,
    ul: (props: any) => <ul className="list-disc pl-6 mb-4 space-y-1.5 text-gray-700 text-sm sm:text-base" {...props} />,
    ol: (props: any) => <ol className="list-decimal pl-6 mb-4 space-y-1.5 text-gray-700 text-sm sm:text-base" {...props} />,
    li: (props: any) => <li className="mb-0.5" {...props} />,
    a: (props: any) => <a className="text-blue-600 hover:underline hover:text-blue-800 font-medium break-all" target="_blank" rel="noopener noreferrer" {...props} />,
    blockquote: (props: any) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4 bg-blue-50/50 py-2 pr-2 rounded-r" {...props} />
    ),
    code: ({ node, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      const isInline = !match;
      return isInline ? (
        <code className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono font-semibold" {...props}>
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
      <div className="overflow-x-auto my-4 rounded-lg border border-gray-100 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200" {...props} />
      </div>
    ),
    th: (props: any) => <th className="bg-gray-50 px-4 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b" {...props} />,
    td: (props: any) => <td className="px-4 py-2 text-sm text-gray-600 border-b" {...props} />,
    img: (props: any) => <img className="rounded-xl max-h-96 mx-auto object-cover my-4 shadow-md" {...props} />,
  };

  return (
    <div className="flex flex-col border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
      {/* Control Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200 shrink-0">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">কনটেন্ট রাইটার</span>
        <div className="flex bg-gray-200/60 p-0.5 rounded-lg">
          <button
            type="button"
            onClick={() => setViewMode("edit")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              viewMode === "edit" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("split")}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              viewMode === "split" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Columns className="h-3.5 w-3.5" />
            <span>Split</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              viewMode === "preview" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      {/* Editor & Preview Pane */}
      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200 min-h-[400px]">
        {/* Left Side: Editor */}
        <div className={`${viewMode === "preview" ? "hidden" : viewMode === "edit" ? "col-span-2" : "col-span-1"}`}>
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "এখানে আপনার ব্লগ পোস্টটি লিখুন (Markdown ফরম্যাট সমর্থিত)..."}
            className="w-full h-full min-h-[400px] p-4 text-gray-800 font-mono text-sm border-0 focus:ring-0 focus:outline-none resize-y"
          />
        </div>

        {/* Right Side: Preview */}
        <div
          className={`p-5 overflow-y-auto bg-gray-50/30 prose max-w-none ${
            viewMode === "edit" ? "hidden" : viewMode === "preview" ? "col-span-2" : "col-span-1"
          }`}
          style={{ minHeight: "400px" }}
        >
          {value ? (
            <ReactMarkdown components={markdownComponents}>{value}</ReactMarkdown>
          ) : (
            <p className="text-gray-400 italic text-sm text-center pt-20">লাইভ প্রিভিউ দেখার জন্য কিছু লিখুন...</p>
          )}
        </div>
      </div>
    </div>
  );
}
