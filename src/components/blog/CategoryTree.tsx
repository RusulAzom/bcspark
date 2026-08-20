// src/components/blog/CategoryTree.tsx
"use client";

import { useState } from "react";
import { Category } from "@/lib/blog-helpers";
import { ChevronRight, ChevronDown, Folder } from "lucide-react";

interface CategoryTreeProps {
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  categoryCounts: { [categoryId: string]: number };
}

interface TreeNodeProps {
  category: Category;
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  categoryCounts: { [categoryId: string]: number };
  depth: number;
}

function TreeNode({
  category,
  selectedCategoryId,
  onSelectCategory,
  categoryCounts,
  depth,
}: TreeNodeProps) {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = category.children && category.children.length > 0;
  const isSelected = selectedCategoryId === category.id;
  const count = categoryCounts[category.id] || 0;

  return (
    <div className="flex flex-col">
      <div
        className={`flex items-center justify-between py-1.5 px-3 rounded-lg cursor-pointer transition-colors text-sm group ${
          isSelected
            ? "bg-blue-50 text-blue-600 font-semibold"
            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        <div
          className="flex items-center gap-2 flex-1 min-w-0"
          onClick={() => onSelectCategory(category.id)}
        >
          <Folder
            className={`h-4 w-4 shrink-0 ${
              isSelected ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
            }`}
          />
          <span className="truncate">{category.name}</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              isSelected ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"
            }`}
          >
            {count}
          </span>
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              className="p-1 hover:bg-gray-200 rounded text-gray-500 transition-colors"
            >
              {isOpen ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
            </button>
          )}
        </div>
      </div>
      {hasChildren && isOpen && (
        <div className="flex flex-col mt-0.5">
          {category.children!.map((child) => (
            <TreeNode
              key={child.id}
              category={child}
              selectedCategoryId={selectedCategoryId}
              onSelectCategory={onSelectCategory}
              categoryCounts={categoryCounts}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoryTree({
  categories,
  selectedCategoryId,
  onSelectCategory,
  categoryCounts,
}: CategoryTreeProps) {
  if (!categories || categories.length === 0) {
    return <p className="text-sm text-gray-500 p-2">No categories found</p>;
  }

  return (
    <div className="space-y-1">
      {categories.map((category) => (
        <TreeNode
          key={category.id}
          category={category}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={onSelectCategory}
          categoryCounts={categoryCounts}
          depth={0}
        />
      ))}
    </div>
  );
}
