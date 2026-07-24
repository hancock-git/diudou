"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BookmarkCheck,
  Copy,
  FileText,
  Film,
  LayoutList,
  Library,
  MessageSquare,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CategoryFilter = "all" | "collected";
type TypeFilter = "all" | "copy" | "storyboard";

type LibraryEntry = {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryKind: CategoryFilter;
  storyboard: string;
  storyboardKind: TypeFilter;
  time: string;
};

const ENTRIES: LibraryEntry[] = [
  {
    id: "biscuit",
    title: "饼干礼盒投放脚本",
    description:
      "先别划走，这个细节很多人买错了。 重点看这里，真正拉开差距的是这个卖点。 适合想省事又想要效果的人，今天这个机制更划算。",
    category: "历史收藏",
    categoryKind: "collected",
    storyboard: "仅文案",
    storyboardKind: "copy",
    time: "示例",
  },
  {
    id: "tissue",
    title: "湿水不破测评脚本",
    description:
      "纸巾一碰水就烂？这个测试先看完。 浸水后直接拉扯，韧性差别很明显。 家里有娃、做清洁、擦厨房，都适合囤这个。",
    category: "历史收藏",
    categoryKind: "collected",
    storyboard: "仅文案",
    storyboardKind: "copy",
    time: "示例",
  },
];

const CATEGORY_FILTERS: { key: CategoryFilter; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "collected", label: "历史收藏" },
];

const TYPE_FILTERS: { key: TypeFilter; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "copy", label: "仅文案" },
  { key: "storyboard", label: "含分镜" },
];

type StatCard = {
  key: string;
  icon: typeof FileText;
  value: string;
  label: string;
};

const STATS: StatCard[] = [
  {
    key: "all",
    icon: FileText,
    value: "2",
    label: "全部收藏 · 文案和分镜",
  },
  {
    key: "copy",
    icon: MessageSquare,
    value: "2",
    label: "文案 · 输入与改写",
  },
  {
    key: "storyboard",
    icon: Film,
    value: "0",
    label: "含分镜 · 已拆分镜",
  },
  {
    key: "collected",
    icon: BookmarkCheck,
    value: "2",
    label: "历史收藏 · 示例沉淀",
  },
];

export default function LibraryPage() {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [type, setType] = useState<TypeFilter>("all");
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return ENTRIES.filter((entry) => {
      if (category !== "all" && entry.categoryKind !== category) return false;
      if (type !== "all" && entry.storyboardKind !== type) return false;
      if (search.trim().length > 0) {
        const needle = search.trim().toLowerCase();
        return (
          entry.title.toLowerCase().includes(needle) ||
          entry.description.toLowerCase().includes(needle)
        );
      }
      return true;
    });
  }, [category, type, search]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleCopy = async (entry: LibraryEntry) => {
    try {
      if (
        typeof navigator !== "undefined" &&
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === "function"
      ) {
        await navigator.clipboard.writeText(entry.title);
      }
      setCopiedId(entry.id);
      window.setTimeout(() => setCopiedId(null), 1200);
    } catch {
      setCopiedId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Library className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-semibold text-slate-950">
                文案/分镜库
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                保存工作台文案、改写结果和拆分镜历史，点击即可回到右侧工作台继续处理。
              </p>
            </div>
          </div>
          <Link
            href="/agent/ecommerce/copywriting"
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary/90"
          >
            <Pencil className="h-4 w-4" />
            写新文案
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.key}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-2xl font-semibold tabular-nums text-slate-950">
                    {stat.value}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    {stat.label}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* History section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-950">
              文案/分镜历史
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              列表模式仅展示关键信息，点击进入工作台后再展开完整文案改写。
            </p>
          </div>
          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full items-center gap-2 lg:w-auto"
          >
            <div className="relative flex-1 lg:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索文案关键词"
                className="h-9 w-full rounded-full border border-slate-200 bg-white pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-9 items-center gap-1 rounded-full bg-primary px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary/90"
            >
              搜索
            </button>
          </form>
        </div>

        {/* Filter rows */}
        <div className="mt-5 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500">
              素材分类管理
            </span>
            {CATEGORY_FILTERS.map((f) => {
              const isActive = category === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setCategory(f.key)}
                  className={cn(
                    "inline-flex h-7 items-center rounded-full px-3 text-xs font-medium transition-colors",
                    isActive
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                  )}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {TYPE_FILTERS.map((f) => {
                const isActive = type === f.key;
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setType(f.key)}
                    className={cn(
                      "inline-flex h-7 items-center rounded-full px-3 text-xs font-medium transition-colors",
                      isActive
                        ? "bg-primary text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                    )}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
            <div className="inline-flex items-center gap-1 text-xs text-slate-500">
              <LayoutList className="h-3.5 w-3.5" />
              列表模式
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[720px] border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr className="text-xs font-medium text-slate-500">
                <th className="border-b border-slate-200 pb-3 pr-4 font-medium">
                  素材
                </th>
                <th className="border-b border-slate-200 pb-3 pr-4 font-medium">
                  分类
                </th>
                <th className="border-b border-slate-200 pb-3 pr-4 font-medium">
                  分镜
                </th>
                <th className="border-b border-slate-200 pb-3 pr-4 font-medium">
                  时间
                </th>
                <th className="border-b border-slate-200 pb-3 pr-2 text-right font-medium">
                  操作
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-10 text-center text-sm text-slate-400"
                  >
                    没有匹配的素材
                  </td>
                </tr>
              ) : (
                filtered.map((entry) => (
                  <tr
                    key={entry.id}
                    className="group align-top transition-colors hover:bg-slate-50/70"
                  >
                    <td className="border-b border-slate-100 py-4 pr-4">
                      <div className="text-sm font-semibold text-slate-950">
                        {entry.title}
                      </div>
                      <div className="mt-1 line-clamp-2 max-w-md text-xs leading-5 text-slate-500">
                        {entry.description}
                      </div>
                    </td>
                    <td className="border-b border-slate-100 py-4 pr-4 align-top">
                      <span className="inline-flex h-6 items-center rounded-full bg-slate-100 px-2.5 text-[11px] font-medium text-slate-600">
                        {entry.category}
                      </span>
                    </td>
                    <td className="border-b border-slate-100 py-4 pr-4 align-top">
                      <span className="inline-flex h-6 items-center rounded-full bg-slate-100 px-2.5 text-[11px] font-medium text-slate-600">
                        {entry.storyboard}
                      </span>
                    </td>
                    <td className="border-b border-slate-100 py-4 pr-4 align-top text-xs text-slate-500">
                      {entry.time}
                    </td>
                    <td className="border-b border-slate-100 py-4 pr-2 align-top">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href="/agent/ecommerce/copywriting"
                          className="inline-flex h-7 items-center rounded-md bg-primary px-3 text-xs font-medium text-white shadow-sm transition-colors hover:bg-primary/90"
                        >
                          进入工作台
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleCopy(entry)}
                          className="inline-flex h-7 items-center gap-1 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
                        >
                          <Copy className="h-3 w-3" />
                          {copiedId === entry.id ? "已复制" : "复制"}
                        </button>
                        <button
                          type="button"
                          aria-label="删除"
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400 transition-colors hover:bg-slate-50 hover:text-red-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
