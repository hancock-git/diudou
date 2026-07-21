"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowDownUp,
  ChevronDown,
  Cloud,
  Folder,
  Grid2x2,
  Image as ImageIcon,
  ListChecks,
  MessageSquareQuote,
  Music,
  Plus,
  Search,
  Trash2,
  Video as VideoIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { ASSET_ITEMS, type AssetItem } from "@/lib/assets-data";

type FilterKind = "all" | "image" | "video" | "audio";
type SourceFilter = "all" | "local" | "generated" | "copy";
type SortDir = "desc" | "asc";

interface Vault {
  id: string;
  name: string;
  count: number;
  origin: string;
  tone: "blue" | "slate";
}

const VAULTS: Vault[] = [
  { id: "v-1", name: "生成结果", count: 9, origin: "图片 / 视频 / 音频", tone: "blue" },
  { id: "v-2", name: "测试", count: 1, origin: "本地上传", tone: "slate" },
  { id: "v-3", name: "沪上阿姨", count: 0, origin: "本地上传", tone: "slate" },
];

const TYPE_TABS: Array<{
  key: FilterKind;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}> = [
  { key: "all", label: "全部", icon: Grid2x2 },
  { key: "image", label: "图片", icon: ImageIcon },
  { key: "video", label: "视频", icon: VideoIcon },
  { key: "audio", label: "音频", icon: Music },
];

const SOURCE_OPTIONS: Array<{ key: SourceFilter; label: string }> = [
  { key: "all", label: "全部来源" },
  { key: "local", label: "本地上传" },
  { key: "generated", label: "生成结果" },
  { key: "copy", label: "文案资产" },
];

const ASSET_TYPE_OPTIONS = [
  "商品素材",
  "场景素材",
  "参考素材",
  "视频",
  "音频",
  "文档",
  "品牌资产",
  "模板",
  "其他",
];

const SOURCE_MATCH: Record<Exclude<SourceFilter, "all">, string> = {
  local: "本地上传",
  generated: "AI生成",
  copy: "文案资产",
};

export default function AssetsPage() {
  const [activeVault, setActiveVault] = useState<string>("v-1");
  const [typeFilter, setTypeFilter] = useState<FilterKind>("all");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [search, setSearch] = useState("");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [items, setItems] = useState<AssetItem[]>(ASSET_ITEMS);

  const visible = useMemo(() => {
    const query = search.trim().toLowerCase();
    // ASSET_ITEMS is already ordered newest-first (the site's default "降序").
    const filtered = items.filter((item) => {
      if (typeFilter !== "all" && item.kind !== typeFilter) return false;
      if (sourceFilter !== "all" && item.source !== SOURCE_MATCH[sourceFilter])
        return false;
      if (query && !item.title.toLowerCase().includes(query)) return false;
      return true;
    });
    return sortDir === "desc" ? filtered : [...filtered].reverse();
  }, [items, typeFilter, sourceFilter, search, sortDir]);

  const handleDelete = (id: string) =>
    setItems((prev) => prev.filter((item) => item.id !== id));

  return (
    <section className="min-h-[720px] rounded-[28px] bg-[#f7f7f8] px-4 py-7 text-slate-950 sm:px-8 lg:px-14">
      <div className="mx-auto w-full max-w-[1440px]">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">我的资产</h1>
          <button
            type="button"
            aria-label="刷新资产"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-800"
          >
            <Cloud className="h-4 w-4" />
          </button>
        </div>
        <p className="sr-only">
          分类：全部、图片、视频、音频、商品图、参考视频、口播、成片、提示词。每个素材支持：用途、关联商品、来源、标签、生成记录、是否可复用。
        </p>

        {/* Vault tiles */}
        <div className="mt-14 flex flex-wrap items-start gap-8">
          <NewVaultTile />
          {VAULTS.map((vault) => (
            <VaultTile
              key={vault.id}
              vault={vault}
              active={vault.id === activeVault}
              onSelect={() => setActiveVault(vault.id)}
            />
          ))}
        </div>

        {/* Toolbar */}
        <div className="mt-10 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded-lg bg-slate-200/70 p-0.5">
              {TYPE_TABS.map((tab) => {
                const Icon = tab.icon;
                const active = typeFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setTypeFilter(tab.key)}
                    className={cn(
                      "inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition",
                      active
                        ? "bg-white text-slate-950 shadow-sm"
                        : "text-slate-500 hover:text-slate-800",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <label className="relative">
              <select
                value={sourceFilter}
                onChange={(event) =>
                  setSourceFilter(event.target.value as SourceFilter)
                }
                className="h-10 min-w-[150px] cursor-pointer appearance-none rounded-lg border border-slate-200 bg-white pl-4 pr-9 text-sm font-medium text-slate-950 outline-none transition-colors hover:border-slate-300 focus:border-slate-300"
              >
                {SOURCE_OPTIONS.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            </label>

            <label className="relative min-w-[220px] flex-1 xl:flex-none">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                type="text"
                placeholder="关键词搜索"
                className="h-10 w-full rounded-lg border border-transparent bg-transparent pl-9 pr-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-slate-200 focus:bg-white"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-950 transition-colors hover:border-slate-300"
            >
              <ListChecks className="h-4 w-4 text-slate-500" />
              批量操作
            </button>
            <button
              type="button"
              onClick={() =>
                setSortDir((dir) => (dir === "desc" ? "asc" : "desc"))
              }
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-500 transition-colors hover:border-slate-300 hover:text-slate-800"
            >
              <ArrowDownUp className="h-4 w-4 text-slate-500" />
              {sortDir === "desc" ? "降序" : "升序"}
            </button>
          </div>
        </div>

        {/* Grid */}
        <section className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
          <AddCard />
          {visible.map((item) => (
            <AssetCard
              key={item.id}
              item={item}
              onDelete={() => handleDelete(item.id)}
            />
          ))}
        </section>
      </div>
    </section>
  );
}

/* ----------------------------- Vault tiles ----------------------------- */

function NewVaultTile() {
  return (
    <div className="group relative w-[150px] text-center">
      <button type="button" className="block w-full">
        <div className="relative mx-auto h-[88px] w-[132px]">
          <div className="absolute left-4 top-0 h-9 w-[92px] rounded-[18px] border border-slate-200 bg-white/60" />
          <div className="absolute inset-x-0 bottom-0 flex h-[74px] items-center justify-center rounded-[18px] border border-white/80 bg-white/50 shadow-sm backdrop-blur-[24px] transition group-hover:border-slate-300">
            <Plus className="h-7 w-7 text-slate-500" />
          </div>
        </div>
        <div className="mt-2 text-sm font-semibold text-slate-950">
          新建资产库
        </div>
      </button>
    </div>
  );
}

function VaultTile({
  vault,
  active,
  onSelect,
}: {
  vault: Vault;
  active: boolean;
  onSelect: () => void;
}) {
  const blue = active && vault.tone === "blue";
  return (
    <div className="group relative w-[150px] text-center">
      <button type="button" onClick={onSelect} className="block w-full">
        <div className="relative mx-auto h-[88px] w-[132px]">
          {/* back tab */}
          <div
            className={cn(
              "absolute left-4 top-0 h-9 w-[92px] rounded-[18px] border",
              blue
                ? "border-sky-200/70 bg-sky-100/70"
                : active
                  ? "border-slate-300 bg-white/80"
                  : "border-slate-200 bg-white/60",
            )}
          />
          {/* front body */}
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 flex h-[74px] items-center justify-center rounded-[18px] border shadow-sm backdrop-blur-[24px] transition",
              blue
                ? "border-sky-100 bg-gradient-to-br from-white to-sky-50"
                : active
                  ? "border-slate-300 bg-white/80"
                  : "border-white/80 bg-white/60 group-hover:border-slate-300",
            )}
          >
            <Folder className="h-7 w-7 text-slate-500" strokeWidth={1.75} />
            <span className="absolute right-2 top-2 rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-slate-500 shadow-sm">
              {vault.count}
            </span>
          </div>
        </div>
        <div className="mt-2 text-sm font-semibold text-slate-950">
          {vault.name}
        </div>
        <div className="mt-4 text-xs text-slate-500">{vault.origin}</div>
      </button>
    </div>
  );
}

/* ------------------------------- Add card ------------------------------ */

function AddCard() {
  return (
    <article>
      <button
        type="button"
        className="flex aspect-square w-full flex-col items-center justify-center rounded-lg border border-slate-200 bg-white/60 shadow-sm transition-colors hover:border-slate-300 hover:bg-white"
      >
        <Plus className="h-9 w-9 text-slate-500" />
        <span className="mt-4 text-sm font-semibold text-slate-950">添加</span>
      </button>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-950">添加资产</div>
          <div className="mt-1 text-xs text-slate-500">本地上传</div>
        </div>
        <label className="relative shrink-0">
          <select
            defaultValue="其他"
            className="h-7 max-w-[96px] cursor-pointer appearance-none rounded-md border border-slate-200 bg-white pl-2 pr-5 text-xs text-slate-500 outline-none transition-colors hover:border-slate-300"
          >
            {ASSET_TYPE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-1 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </label>
      </div>
    </article>
  );
}

/* ------------------------------ Asset card ----------------------------- */

function DeleteButton({ onDelete }: { onDelete: () => void }) {
  return (
    <button
      type="button"
      onClick={onDelete}
      aria-label="删除该资产"
      className="absolute right-3 top-3 flex h-9 w-9 scale-95 items-center justify-center rounded-full bg-white/95 text-slate-400 opacity-0 shadow-sm ring-1 ring-slate-200 backdrop-blur transition group-hover:scale-100 group-hover:opacity-100 hover:text-rose-500"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}

function InfoRow({ item }: { item: AssetItem }) {
  return (
    <div className="mt-3 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-slate-950">
          {item.title}
        </div>
        <div className="mt-1 truncate text-xs text-slate-500">
          {item.source}
        </div>
      </div>
      <span className="shrink-0 text-xs text-slate-400">{item.date}</span>
    </div>
  );
}

function AssetCard({
  item,
  onDelete,
}: {
  item: AssetItem;
  onDelete: () => void;
}) {
  if (item.kind === "text") {
    return (
      <article className="group relative rounded-xl transition">
        <button type="button" className="block w-full text-left">
          <div className="aspect-square overflow-hidden rounded-lg border border-slate-200 bg-white/70 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <MessageSquareQuote className="h-5 w-5" />
            </div>
            <p className="mt-5 line-clamp-6 whitespace-pre-line text-sm leading-6 text-slate-600">
              {item.quote}
            </p>
          </div>
          <InfoRow item={item} />
        </button>
        <DeleteButton onDelete={onDelete} />
      </article>
    );
  }

  const isVideo = item.kind === "video";

  return (
    <article className="group relative rounded-xl transition">
      <button type="button" className="block w-full text-left">
        <div
          className={cn(
            "relative aspect-square overflow-hidden rounded-lg border border-slate-200 shadow-sm",
            isVideo ? "bg-black" : "bg-white",
          )}
        >
          {isVideo ? (
            <video
              src={item.url}
              muted
              playsInline
              preload="metadata"
              className="h-full w-full bg-black object-cover"
            />
          ) : item.url ? (
            <Image
              src={item.url}
              alt={item.title}
              fill
              sizes="(min-width: 1536px) 18vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
              className="object-cover"
            />
          ) : null}

          {isVideo ? (
            <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
              视频
            </span>
          ) : null}
        </div>
        <InfoRow item={item} />
      </button>
      <DeleteButton onDelete={onDelete} />
    </article>
  );
}
