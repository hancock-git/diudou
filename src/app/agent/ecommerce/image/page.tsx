"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  ChevronDown,
  Image as ImageIcon,
  Paperclip,
  Plus,
  Ratio,
  Sparkles,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";

type GenMode = "text" | "image";

type HistoryFilter = "all" | "text" | "image";

interface HistoryItem {
  id: string;
  prompt: string;
  mode: GenMode;
  size: string;
  time: string;
  thumbnail?: string;
}

const HISTORY_SEED: HistoryItem[] = [
  {
    id: "h-01",
    prompt:
      "生成一张世界杯球场看台的女生照片，女生是冷白皮，皮肤白皙通透，柔和皮肤高光，女生面部整体清秀干净。",
    mode: "text",
    size: "自动尺寸",
    time: "18:28",
    thumbnail: "/images/ai/img-01.png",
  },
  {
    id: "h-02",
    prompt:
      "生成一张@图1美女，一手拿着@图2中沪上阿姨威化小方的产品，另一只手拿着一块@图3中的威化小方，品尝一口的画面。",
    mode: "image",
    size: "自动尺寸",
    time: "17:34",
    thumbnail: "/images/ai/img-02.png",
  },
  {
    id: "h-03",
    prompt: "生成一张具有真实感的海绵宝宝和祖国人在一起的合影",
    mode: "text",
    size: "自动尺寸",
    time: "17:30",
    thumbnail: "/images/ai/img-03.png",
  },
  {
    id: "h-04",
    prompt: "生成一张海南旅游的宣传图",
    mode: "text",
    size: "自动尺寸",
    time: "17:25",
    thumbnail: "/images/ai/img-04.png",
  },
  {
    id: "h-05",
    prompt: "生成一张蒙牛牛奶电商产品宣传图",
    mode: "text",
    size: "自动尺寸",
    time: "16:52",
    thumbnail: "/images/ai/img-02.png",
  },
  {
    id: "h-06",
    prompt:
      "把参考图中右边的女生，单独剥离出来，保留原有姿态和光影，替换到干净的白背景上。",
    mode: "image",
    size: "自动尺寸",
    time: "21:53",
    thumbnail: "/images/ai/img-01.png",
  },
  {
    id: "h-07",
    prompt:
      "将图1的真人照片转化为图2的复古90年代日漫赛璐璐动画风格，保留人物特征。",
    mode: "image",
    size: "自动尺寸",
    time: "21:48",
    thumbnail: "/images/ai/img-03.png",
  },
  {
    id: "h-08",
    prompt: "把图1的照片生成图2的Q版偶像饭绘风格的图片",
    mode: "image",
    size: "自动尺寸",
    time: "20:26",
    thumbnail: "/images/ai/img-04.png",
  },
  {
    id: "h-09",
    prompt: "把参考图中的水印“@可可卷”去掉，其他元素保持不变",
    mode: "image",
    size: "自动尺寸",
    time: "20:33",
    thumbnail: "/images/ai/img-02.png",
  },
  {
    id: "h-10",
    prompt: "生成一张湖北红安的旅游宣传图",
    mode: "text",
    size: "自动尺寸",
    time: "00:29",
    thumbnail: "/images/ai/img-04.png",
  },
];

const HISTORY_TABS: Array<{ key: HistoryFilter; label: string }> = [
  { key: "all", label: "全部" },
  { key: "text", label: "文生图" },
  { key: "image", label: "图生图" },
];

const MODE_TABS: Array<{ key: GenMode; label: string }> = [
  { key: "text", label: "文生图" },
  { key: "image", label: "图生图" },
];

const MODE_LABEL: Record<GenMode, string> = {
  text: "文生图",
  image: "图生图",
};

export default function ImageGenerationPage() {
  const [mode, setMode] = useState<GenMode>("text");
  const [prompt, setPrompt] = useState("");
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>("all");
  const [history, setHistory] = useState<HistoryItem[]>(HISTORY_SEED);

  const filteredHistory = useMemo(() => {
    if (historyFilter === "all") return history;
    return history.filter((item) => item.mode === historyFilter);
  }, [history, historyFilter]);

  const handleDelete = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const canGenerate = prompt.trim().length > 0;

  return (
    <div className="grid grid-cols-1 gap-4 lg:h-[calc(100dvh-116px)] lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
      {/* Left column: main workspace */}
      <div className="flex min-h-0 min-w-0 flex-col gap-4">
        {/* Top row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-950">AI 生图</h1>
            <p className="mt-1 text-xs text-slate-500">
              每次进入默认是新窗口，点击历史记录才会回填旧配置。
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <Plus className="h-3.5 w-3.5" />
            创建新窗口
          </button>
        </div>

        {/* Big canvas card */}
        <div className="flex min-h-0 flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl bg-gradient-to-br from-slate-50 via-white to-slate-50 py-10 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-400 shadow-sm">
              <ImageIcon className="h-6 w-6" strokeWidth={1.6} />
            </div>
            <div className="text-sm font-semibold text-slate-700">
              图片会显示在这里
            </div>
            <p className="max-w-sm text-xs leading-5 text-slate-500">
              输入提示词或添加参考图，生成后的图片会显示在这里。
            </p>
          </div>
        </div>

        {/* Composer */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-start">
            <button
              type="button"
              className="inline-flex h-8 shrink-0 items-center justify-center gap-1 self-start rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              <Paperclip className="h-3.5 w-3.5" />
              参考图
            </button>

            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="描述你想生成的图片…"
              className="min-h-[64px] flex-1 resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-800 outline-none placeholder:text-slate-400 focus:border-primary/30 focus:bg-white focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <ModeToggle mode={mode} onChange={setMode} />

              <button
                type="button"
                className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                <Sparkles className="h-3.5 w-3.5 text-slate-500" />
                gpt-image-2-pro
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>

              <button
                type="button"
                className="inline-flex h-8 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                <Ratio className="h-3.5 w-3.5 text-slate-500" />
                1:1 · 自动
                <ChevronDown className="h-3 w-3 text-slate-400" />
              </button>
            </div>

            <button
              type="button"
              disabled={!canGenerate}
              className={cn(
                "inline-flex h-8 items-center justify-center gap-1 rounded-lg px-3 text-xs font-semibold transition-colors",
                canGenerate
                  ? "bg-primary text-white shadow-sm hover:bg-primary/90"
                  : "cursor-not-allowed bg-primary/40 text-white/80",
              )}
            >
              <Sparkles className="h-3.5 w-3.5" />
              生成图片
            </button>
          </div>
        </div>
      </div>

      {/* Right column: history sidebar */}
      <aside className="flex min-h-0 flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold text-slate-950">历史记录</h2>
          <span className="text-[11px] text-slate-400">
            {filteredHistory.length} 条
          </span>
        </div>

        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1">
          {HISTORY_TABS.map((tab) => {
            const active = historyFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setHistoryFilter(tab.key)}
                className={cn(
                  "h-7 flex-1 rounded-md px-3 text-[11px] font-medium transition",
                  active
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500 hover:text-slate-900",
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="no-scrollbar -mx-1 flex flex-col gap-2 overflow-y-auto px-1 pb-1 lg:max-h-[680px]">
          {filteredHistory.map((item) => (
            <HistoryCard
              key={item.id}
              item={item}
              onDelete={() => handleDelete(item.id)}
            />
          ))}

          {filteredHistory.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-slate-200 bg-slate-50 py-10 text-center">
              <ImageIcon className="h-5 w-5 text-slate-300" />
              <p className="text-[11px] text-slate-400">暂无历史记录</p>
            </div>
          ) : null}
        </div>
      </aside>
    </div>
  );
}

interface ModeToggleProps {
  mode: GenMode;
  onChange: (mode: GenMode) => void;
}

function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1">
      {MODE_TABS.map((tab) => {
        const active = mode === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={cn(
              "h-6 rounded-md px-2.5 text-[11px] font-medium transition",
              active
                ? "bg-white text-slate-950 shadow-sm"
                : "text-slate-500 hover:text-slate-900",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

interface HistoryCardProps {
  item: HistoryItem;
  onDelete: () => void;
}

function HistoryCard({ item, onDelete }: HistoryCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white p-3 transition-colors hover:bg-slate-50 hover:shadow-sm">
      {item.thumbnail ? (
        <div className="relative mb-2 aspect-[4/3] overflow-hidden rounded-md border border-slate-200 bg-slate-100">
          <Image
            src={item.thumbnail}
            alt={item.prompt}
            fill
            sizes="(min-width: 1280px) 260px, (min-width: 1024px) 220px, 90vw"
            className="object-cover"
          />
        </div>
      ) : null}

      <button
        type="button"
        onClick={onDelete}
        aria-label="删除该条记录"
        className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-md border border-transparent bg-white/90 text-slate-400 opacity-0 shadow-sm backdrop-blur transition hover:border-slate-200 hover:text-red-500 group-hover:opacity-100"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      <p className="line-clamp-2 cursor-pointer text-xs leading-5 text-slate-700">
        {item.prompt}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500">
        <span className="rounded-sm bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600">
          {MODE_LABEL[item.mode]}
        </span>
        <span className="rounded-sm bg-slate-100 px-1.5 py-0.5 text-slate-600">
          {item.size}
        </span>
        <span className="ml-auto tabular-nums text-slate-400">{item.time}</span>
      </div>
    </div>
  );
}
