// src/components/blog/RichTextEditor.tsx
// A headless Tiptap-based rich text editor with a formatting toolbar, inline
// image upload, YouTube embed, link management, and a toggleable raw-HTML mode
// plus a live preview pane.
//
// The editor keeps a single internal HTML source of truth (`htmlValue`). Every
// change is reported to the parent via `onChange(contentHtml, contentJson)` so
// the parent can persist BOTH a sanitized HTML string and the editor JSON.
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Youtube } from "@tiptap/extension-youtube";
import { sanitizeHtml } from "@/lib/sanitize";
import { toast } from "sonner";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  CodeXml,
  Link,
  Unlink,
  Image as ImageIcon,
  Play,
  Eye,
  Edit3,
  Code,
} from "lucide-react";

export interface RichTextEditorProps {
  /** Initial HTML content (used once to seed the editor). */
  initialHtml?: string;
  /** Initial Tiptap JSON content (preferred over HTML when present). */
  initialJson?: any;
  /** Fired on every change with the raw HTML + editor JSON. */
  onChange: (contentHtml: string, contentJson: any) => void;
  /** Uploads an image file and resolves with a public download URL. */
  uploadImage: (file: File) => Promise<string>;
  /** Placeholder text shown when the editor is empty. */
  placeholder?: string;
}

type ViewMode = "visual" | "html" | "preview";
type ActiveInput = "link" | "youtube" | null;

// Tiptap extensions — StarterKit (minus standalone Link config) + Image + YouTube
function buildExtensions() {
  return [
    StarterKit.configure({
      // Restrict to a sensible heading range while still allowing h2/h3.
      heading: { levels: [1, 2, 3, 4] },
      link: {
        openOnClick: false, // don't navigate while editing
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      },
    }),
    Image.configure({
      HTMLAttributes: {
        class: "max-w-full h-auto rounded-xl my-5 shadow-md",
      },
    }),
    Youtube.configure({
      nocookie: true,
      width: 640,
      height: 360,
      allowFullscreen: true,
    }),
  ];
}

// Helper: read the active link href (if any) from the current selection.
function getActiveLink(editor: any): string {
  if (!editor) return "";
  const attrs = editor.getAttributes("link");
  return attrs?.href || "";
}

function ToolbarButton({
  active,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      data-active={active || undefined}
      className="relative group flex items-center justify-center w-9 h-9 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 outline-none transition-colors disabled:opacity-40 disabled:cursor-not-allowed
                 data-[active=true]:bg-blue-50 data-[active=true]:text-blue-700"
    >
      {children}
      <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-max text-[9px] font-medium text-gray-400 group-hover:text-gray-500 opacity-0 group-hover:opacity-100 whitespace-nowrap">
        {title}
      </span>
    </button>
  );
}

export default function RichTextEditor({
  initialHtml,
  initialJson,
  onChange,
  uploadImage,
  placeholder = "ব্লগের কন্টেন্ট এখানে লিখুন...",
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loadedRef = useRef(false); // ensures initial content is only loaded once
  const [htmlValue, setHtmlValue] = useState<string>(initialHtml || "");
  const [viewMode, setViewMode] = useState<ViewMode>("visual");
  const [activeInput, setActiveInput] = useState<ActiveInput>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const extensions = useMemo(() => buildExtensions(), []);

  const editor = useEditor({
    extensions,
    content: initialHtml || "",
    editorProps: {
      // Attributes added to the editor's contenteditable wrapper.
      attributes: {
        class: "outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      // Only track + report in visual mode to avoid fighting the HTML textarea.
      if (viewMode === "visual") {
        const html = editor.getHTML();
        setHtmlValue(html);
        onChange(html, editor.getJSON());
      }
    },
  });

  // Seed the editor with the initial HTML/JSON exactly once.
  useEffect(() => {
    if (!editor || loadedRef.current) return;
    if (!initialJson && !initialHtml) return;

    loadedRef.current = true;
    try {
      if (initialJson && typeof initialJson === "object") {
        editor.commands.setContent(initialJson);
      } else if (initialHtml) {
        editor.commands.setContent(initialHtml);
      }
    } catch (err) {
      console.error("Failed to load editor content:", err);
      editor.commands.setContent("");
    }
  }, [editor, initialJson, initialHtml]);

  // Keep htmlValue in sync with the editor's actual rendered HTML on mount.
  const mountSyncRef = useRef(false);
  useEffect(() => {
    if (!editor || mountSyncRef.current) return;
    mountSyncRef.current = true;
    setHtmlValue(editor.getHTML());
  }, [editor]);

  // ---- Toolbar command handlers ----------------------------------------
  const toggleView = (mode: ViewMode) => {
    if (mode === "visual" && editor) {
      // Push any raw HTML edits back into the editor before switching views.
      editor.commands.setContent(htmlValue);
    }
    setViewMode(mode);
    if (mode !== "html") setActiveInput(null);
  };

  const openLink = () => {
    if (!editor) return;
    setLinkUrl(getActiveLink(editor));
    setActiveInput("link");
  };

  const applyLink = () => {
    if (!editor) return;
    const href = linkUrl.trim();
    if (!href) {
      editor.chain().focus().unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .setLink({ href, target: "_blank", rel: "noopener noreferrer" })
        .run();
    }
    setActiveInput(null);
  };

  const openYoutube = () => {
    setYoutubeUrl("");
    setActiveInput("youtube");
  };

  const applyYoutube = () => {
    if (!editor) return;
    const url = youtubeUrl.trim();
    editor.chain().focus().setYoutubeVideo({ src: url }).run();
    // setYoutubeVideo silently does nothing for invalid URLs; warn the user.
    const hasYoutube = editor.getText().includes("youtube");
    if (!hasYoutube) {
      toast.error("ইউটিউব URLটি আইনানুসারে প্রবেশ করান (যেমন youtu.be/xxxxxx)");
    }
    setActiveInput(null);
  };

  const openImage = () => {
    fileInputRef.current?.click();
  };

  const insertImage = async (file: File) => {
    try {
      const url = await uploadImage(file);
      editor
        ?.chain()
        .focus()
        .setImage({ src: url, alt: file.name, title: file.name })
        .run();
      toast.success("ইমেজ যোগ হয়েছে");
    } catch (err) {
      console.error(err);
      toast.error("ইমেজ আপলোড ব্যর্থ হয়েছে");
    }
  };

  const insertImageFromFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) insertImage(file);
    e.target.value = "";
  };

  const EditorToolbar = () => (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50/70 border-b border-gray-200">
      {/* Inline inputs that appear when link/youtube are active */}
      {activeInput === "link" && (
        <div className="flex items-center gap-1.5 mx-1.5 my-0.5">
          <input
            type="url"
            placeholder="https://example.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="w-44 px-2 py-1 text-xs rounded-md border border-gray-200 focus:border-blue-500 focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyLink();
              }
              if (e.key === "Escape") {
                setActiveInput(null);
              }
            }}
            autoFocus
          />
          <button
            type="button"
            onClick={applyLink}
            className="text-[10px] font-semibold text-blue-600 hover:text-blue-800"
          >
            ঠিক
          </button>
        </div>
      )}

      {activeInput === "youtube" && (
        <div className="flex items-center gap-1.5 mx-1.5 my-0.5">
          <input
            type="url"
            placeholder="youtu.be / ইউটিউব URL"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className="w-48 px-2 py-1 text-xs rounded-md border border-gray-200 focus:border-blue-500 focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyYoutube();
              }
              if (e.key === "Escape") {
                setActiveInput(null);
              }
            }}
            autoFocus
          />
          <button
            type="button"
            onClick={applyYoutube}
            className="text-[10px] font-semibold text-blue-600 hover:text-blue-800"
          >
            যোগ করুন
          </button>
        </div>
      )}

      {!activeInput && editor && (
        <>
          <ToolbarButton
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="বোল্ড"
          >
            <Bold className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="ইটালিক"
          >
            <Italic className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            active={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="আন্ডারলাইন"
          >
            <Underline className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            active={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            title="স্ট্রাইকথ্রু"
          >
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <ToolbarButton
            active={editor.isActive("heading", { level: 2 })}
            onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}
            title="হেডিং ২"
          >
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive("heading", { level: 3 })}
            onClick={() => editor.chain().focus().setHeading({ level: 3 }).run()}
            title="হেডিং ৩"
          >
            <Heading3 className="h-4 w-4" />
          </ToolbarButton>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <ToolbarButton
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="বুলেট তালিকা"
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="নম্বরযুক্ত তালিকা"
          >
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            active={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            title="ব্লককোট"
          >
            <Quote className="h-4 w-4" />
          </ToolbarButton>

          <ToolbarButton
            active={editor.isActive("codeBlock")}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            title="কোড ব্লক"
          >
            <CodeXml className="h-4 w-4" />
          </ToolbarButton>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          <ToolbarButton
            active={editor.isActive("link")}
            onClick={openLink}
            title="লিংক"
          >
            <Link className="h-4 w-4" />
          </ToolbarButton>
          {editor.isActive("link") && (
            <ToolbarButton onClick={() => editor.chain().focus().unsetLink().run()} title="লিংক সরিয়ে ফেলুন">
              <Unlink className="h-4 w-4" />
            </ToolbarButton>
          )}
          <ToolbarButton onClick={openImage} title="ইমেজ যোগ করুন">
            <ImageIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={openYoutube} title="ইউটিউব এম্বেড">
            <Play className="h-4 w-4" />
          </ToolbarButton>
        </>
      )}

      <div className="ml-auto flex items-center gap-1 border-l border-gray-300 pl-2">
        <ToolbarButton
          active={viewMode === "visual"}
          onClick={() => toggleView("visual")}
          title="ভিজ্যুয়াল এডিটর"
        >
          <Edit3 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={viewMode === "html"}
          onClick={() => toggleView("html")}
          title="HTML মোড"
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          active={viewMode === "preview"}
          onClick={() => toggleView("preview")}
          title="প্রিভিউ"
        >
          <Eye className="h-4 w-4" />
        </ToolbarButton>
      </div>
    </div>
  );

  // ---- Render -----------------------------------------------------------
  const renderBody = () => {
    if (!editor) {
      return (
        <div className="p-4 text-center text-gray-400 min-h-[200px] flex items-center justify-center">
          এডিটর চালু হচ্ছে...
        </div>
      );
    }

    if (viewMode === "html") {
      return (
        <textarea
          value={htmlValue}
          onChange={(e) => {
            const val = e.target.value;
            setHtmlValue(val);
            // Keep the editor's document state in sync so contentJson stays
            // accurate even while the user edits raw HTML.
            editor.commands.setContent(val);
            onChange(val, editor.getJSON());
          }}
          placeholder="এখানে HTML পেস্ট করুন..."
          className="w-full min-h-[360px] font-mono text-xs text-gray-800 p-4 border-0 resize-y focus:ring-0 focus:outline-none"
        />
      );
    }

    if (viewMode === "preview") {
      const safeHtml = sanitizeHtml(htmlValue);
      return (
        <div
          className="prose prose-lg max-w-none p-5 overflow-y-auto min-h-[360px] text-gray-900"
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      );
    }

    // visual mode
    return (
      <div className="relative">
        <EditorContent
          editor={editor}
          className={`prose prose-sm max-w-none p-4 min-h-[320px] w-full ${
            !htmlValue ? "tiptap-placeholder" : ""
          }`}
        />
        {editor.isEmpty && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 italic pointer-events-none text-center px-4">
            {placeholder}
          </div>
        )}
        {/* Hidden native file input for inline image upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={insertImageFromFile}
          className="hidden"
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm min-h-[420px]">
      <EditorToolbar />
      <div className="flex-1 overflow-y-auto">{renderBody()}</div>
    </div>
  );
}
