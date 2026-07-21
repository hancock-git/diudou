"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  CheckCircle2,
  ChevronDown,
  Clapperboard,
  Clock,
  Copy,
  FileCheck2,
  FolderPlus,
  Image as ImageIcon,
  LayoutPanelLeft,
  Link2,
  Loader2,
  Mic,
  Music,
  Sparkles,
  Upload,
  Video,
  Wand2,
  Waypoints,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  {
    key: "link",
    label: "链接提文案",
    short: "链接",
    icon: Link2,
    kind: "text",
    placeholder: "粘贴视频或图集链接，支持可公开访问的素材页面。",
    hint: "支持主流平台链接，自动抓取并识别口播文案。",
    accept: "",
    formats: "",
  },
  {
    key: "video",
    label: "视频提文案",
    short: "视频",
    icon: Video,
    kind: "file",
    placeholder: "",
    hint: "音轨优先，字幕/OCR 兜底，画面走视觉识别。",
    accept: "video/*",
    formats: "支持 MP4 / MOV / AVI 等，单个文件 ≤ 500MB",
  },
  {
    key: "image",
    label: "图片提文案",
    short: "图片",
    icon: ImageIcon,
    kind: "file",
    placeholder: "",
    hint: "音轨优先，字幕/OCR 兜底，图片走视觉识别。",
    accept: "image/*",
    formats: "支持 JPG / PNG / WEBP 等，可上传商品图或截图",
  },
  {
    key: "voice",
    label: "录音提文案",
    short: "录音",
    icon: Mic,
    kind: "file",
    placeholder: "",
    hint: "自动断句与去噪，转写后可直接编辑整理。",
    accept: "audio/*",
    formats: "支持 MP3 / WAV / M4A 等录音文件",
  },
  {
    key: "audio",
    label: "音频提文案",
    short: "音频",
    icon: Music,
    kind: "file",
    placeholder: "",
    hint: "人声分离优先，背景音乐自动忽略。",
    accept: "audio/*",
    formats: "支持 MP3 / WAV / FLAC 等音频文件",
  },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const MOCK_RESULT: Record<TabKey, string> = {
  link: "### 商品信息\n推测为 **爆款零食礼盒**（如坚果、肉脯、糖果组合等），主打「送礼有面 / 自用管饱」。\n\n### 口播文案\n家人们看过来！这款爆火礼盒今天直接买一送一，源头工厂直发，品质拉满价格打骨折。点开左下角小黄车，前 100 名下单再送专属好礼，手慢无！",
  video: "### 商品信息\n推测为 **便携小家电**（如养生壶、破壁机等），核心卖点「一机多能 · 智能操作」。\n\n### 分镜脚本\n开场：产品特写 +「限时折扣」字幕。中段：真人上手演示效果，突出「一键搞定」。结尾：口播引导「点击下方链接立即抢购」，配合优惠贴片。",
  image: "### 商品信息\n推测为 **旧金山金门大桥主题旅游服务**（如旅行线路、出海观光、摄影体验等）、相关摄影素材/文创产品，或金门大桥周边旅行体验。\n\n### 卖点文案\n主图卖点：高清实拍 · 细节放大 · 场景化展示。建议突出材质与工艺，搭配「今日特价」角标，引导用户点击查看更多详情图。",
  voice: "### 转写文案\n大家好，今天给大家推荐一款超值好物，自用送人都合适，现在下单还有额外优惠，赶紧行动吧！\n\n### 优化建议\n可在开头 3 秒内点出核心卖点，结尾加入明确的行动指令。",
  audio: "### 音频转写\n背景音乐轻快，口播节奏明快，重点强调「性价比」与「限时」。\n\n### 优化建议\n建议第 3 秒插入品牌名，结尾留出行动指令，配合优惠信息引导下单。",
};

const QUICK_ACTIONS = [
  { key: "digital", label: "数字人成片", icon: Video, disabled: true },
  { key: "storyboard", label: "分镜与片段生成", icon: Waypoints, disabled: false },
  { key: "smart", label: "智能成片", icon: Sparkles, disabled: false },
  { key: "canvas", label: "高级画布", icon: LayoutPanelLeft, disabled: false },
] as const;

export function HomeComposer() {
  const [tab, setTab] = useState<TabKey>("link");
  const [value, setValue] = useState("");
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [doneSeconds, setDoneSeconds] = useState<number | null>(null);
  const [quickOpen, setQuickOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);
  const quickRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const current = TABS.find((t) => t.key === tab)!;
  const isFile = current.kind === "file";
  const canExtract = isFile ? fileName.length > 0 : value.trim().length > 0;
  const done = !extracting && result.length > 0;

  const stopTimer = () => {
    if (timerRef.current !== undefined) {
      window.clearInterval(timerRef.current);
      timerRef.current = undefined;
    }
  };

  useEffect(() => stopTimer, []);

  useEffect(() => {
    if (!quickOpen) return;
    const onClick = (e: MouseEvent) => {
      if (quickRef.current && !quickRef.current.contains(e.target as Node)) setQuickOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [quickOpen]);

  const resetState = () => {
    setValue("");
    setFileName("");
    setResult("");
    setCopied(false);
    setExtracting(false);
    setProgress(0);
    setElapsed(0);
    setDoneSeconds(null);
    setQuickOpen(false);
    setDragging(false);
  };

  const switchTab = (key: TabKey) => {
    stopTimer();
    setTab(key);
    resetState();
  };

  const pickFile = (files: FileList | null) => {
    if (files && files.length > 0) setFileName(files[0].name);
  };

  const handleExtract = () => {
    if (!canExtract || extracting) return;
    stopTimer();
    setResult("");
    setCopied(false);
    setDoneSeconds(null);
    setQuickOpen(false);
    setExtracting(true);
    setProgress(0);
    setElapsed(0);

    const startTime = Date.now();
    let p = 0;
    timerRef.current = window.setInterval(() => {
      p = Math.min(100, p + 7);
      const secs = Math.floor((Date.now() - startTime) / 1000);
      setProgress(p);
      setElapsed(secs);
      if (p >= 100) {
        stopTimer();
        setExtracting(false);
        setResult(MOCK_RESULT[tab]);
        setDoneSeconds(Math.max(1, secs));
      }
    }, 220);
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* noop */
    }
  };

  return (
    <div className="home-landing relative w-full overflow-visible">
      <div className="relative z-[1] mx-auto flex w-full max-w-[1240px] flex-col items-center pt-[96px]">
        {/* blue radial wash behind the title */}
        <div className="pointer-events-none absolute left-1/2 top-0 z-0 h-[210px] w-full max-w-[860px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_50%_100%_at_center_8%,#fdfcfc_0%,#9dd2ff_50%,rgba(157,210,255,0)_78%)] blur-[98px]" />

        {/* Title */}
        <div className="relative z-[1]">
          <h1 className="inline-block whitespace-nowrap text-[24px] font-semibold not-italic leading-8 text-[#0f1419] sm:text-[28px] sm:leading-9">
            <span className="text-[#0471FE]">丢抖AI电商</span>
            <span>，为电商而生的</span>
            <span className="text-[#0471FE]">AIGC</span>
            <span>平台</span>
          </h1>
        </div>

        {/* 文案提取 module */}
        <div className="relative z-[1] mt-9 w-full rounded-[22px] border-2 border-white bg-[#fffffff5] p-5 shadow-[0_0_1px_0_rgba(0,0,0,0.1),0_4px_50px_-8px_rgba(0,0,0,0.1)] backdrop-blur-[25px]">
          {/* Header: title + tabs */}
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="flex shrink-0 items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0471FE]/10 text-[#0471FE]">
                <Sparkles className="h-4 w-4" />
              </span>
              <h2 className="text-[15px] font-bold text-[#0f1419]">文案提取</h2>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 xl:ml-2">
              {TABS.map((t) => {
                const active = t.key === tab;
                const Icon = t.icon;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => switchTab(t.key)}
                    className={cn(
                      "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium transition-all duration-200",
                      active
                        ? "bg-[#0471FE] text-white shadow-[0_4px_12px_-2px_rgba(4,113,254,0.5)]"
                        : "bg-[#f4f6f9] text-[#4c535c] hover:bg-[#e9edf3] hover:text-[#0f1419]",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Two panels */}
          <div className="mt-4 grid grid-cols-1 items-start gap-4 lg:grid-cols-2">
            {/* Left: input */}
            <div className="flex flex-col rounded-2xl border border-slate-200 bg-[#f8fafc] p-3">
              <div className="mb-2.5 flex items-center justify-between gap-2">
                <label className="text-sm font-semibold text-[#0f1419]">{current.label}</label>
                <button
                  type="button"
                  onClick={handleExtract}
                  disabled={!canExtract || extracting}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#0471FE] px-3 text-xs font-semibold text-white transition-all hover:bg-[#005bd3] active:scale-95 disabled:cursor-not-allowed disabled:bg-[#c9d3df] disabled:opacity-100"
                >
                  {extracting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />}
                  {extracting ? "提取中" : "提取文案"}
                </button>
              </div>

              {extracting ? (
                <>
                  <div className="flex h-[132px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#0471FE]/40 bg-[#0471FE]/[0.05]">
                    <Loader2 className="h-5 w-5 animate-spin text-[#0471FE]" />
                    <span className="text-sm font-bold text-[#0471FE]">提取中</span>
                  </div>
                  <p className="mt-2 text-center text-xs text-[#8a9099]">{current.hint}</p>
                </>
              ) : isFile ? (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={current.accept}
                    className="hidden"
                    onChange={(e) => pickFile(e.target.files)}
                  />
                  {fileName ? (
                    <div className="flex h-[132px] flex-col items-center justify-center gap-2 rounded-xl border border-[#0471FE]/40 bg-white px-4 text-center">
                      <FileCheck2 className="h-6 w-6 text-[#0471FE]" />
                      <span className="max-w-full truncate text-sm font-medium text-[#0f1419]">{fileName}</span>
                      <div className="flex items-center gap-3 text-xs">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="font-medium text-[#0471FE] hover:underline"
                        >
                          重新选择
                        </button>
                        <button
                          type="button"
                          onClick={() => setFileName("")}
                          className="inline-flex items-center gap-0.5 text-[#8a9099] hover:text-[#0f1419]"
                        >
                          <X className="h-3 w-3" />
                          移除
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                      }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragging(false);
                        pickFile(e.dataTransfer.files);
                      }}
                      className={cn(
                        "flex h-[132px] w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed transition-colors",
                        dragging
                          ? "border-[#0471FE] bg-[#0471FE]/[0.06]"
                          : "border-slate-300 bg-white hover:border-[#0471FE]/50 hover:bg-[#0471FE]/[0.03]",
                      )}
                    >
                      <Upload className="h-5 w-5 text-[#0471FE]" />
                      <span className="text-sm font-medium text-[#0f1419]">点击或拖拽上传{current.short}</span>
                      <span className="px-4 text-center text-xs text-[#b4b8bf]">{current.formats}</span>
                    </button>
                  )}
                </>
              ) : (
                <textarea
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={current.placeholder}
                  aria-label={current.label}
                  className="h-[132px] w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 text-[#1f2937] placeholder:text-[#b4b8bf] focus:border-[#0471FE]/50 focus:outline-none focus:ring-2 focus:ring-[#0471FE]/15"
                />
              )}
            </div>

            {/* Right: result + progress */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col rounded-2xl border border-slate-200 bg-[#f8fafc] p-3">
                <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                  <label className="shrink-0 text-sm font-semibold text-[#0f1419]">
                    提取结果（{current.short}）
                  </label>
                  <div className="flex flex-wrap items-center justify-end gap-1.5">
                    {done && doneSeconds !== null && (
                      <span className="inline-flex h-7 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-[#8a9099]">
                        <Clock className="h-3.5 w-3.5" />
                        本次提取仅用时 {doneSeconds} 秒
                      </span>
                    )}
                    <ResultAction icon={FolderPlus} label="保存到资产库" />
                    <ResultAction icon={Wand2} label="脚本改写/裂变" />
                    <button
                      type="button"
                      onClick={handleCopy}
                      disabled={!result}
                      className="inline-flex h-7 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-[#4c535c] transition-colors hover:bg-slate-50 hover:text-[#0f1419] disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-[#0471FE]" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? "已复制" : "复制"}
                    </button>

                    {/* 快速成片 dropdown */}
                    <div ref={quickRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setQuickOpen((v) => !v)}
                        aria-haspopup="menu"
                        aria-expanded={quickOpen}
                        className="inline-flex h-7 items-center gap-1 rounded-lg bg-[#0471FE] px-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#005bd3]"
                      >
                        <Clapperboard className="h-3.5 w-3.5" />
                        快速成片
                        <ChevronDown className={cn("h-3 w-3 transition-transform", quickOpen && "rotate-180")} />
                      </button>

                      {quickOpen && (
                        <ul
                          role="menu"
                          className="absolute right-0 top-[calc(100%+6px)] z-30 w-[172px] overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-[0_10px_34px_-10px_rgba(0,0,0,0.22)]"
                        >
                          {QUICK_ACTIONS.map((a) => {
                            const Icon = a.icon;
                            return (
                              <li key={a.key}>
                                <button
                                  type="button"
                                  role="menuitem"
                                  disabled={a.disabled}
                                  onClick={() => setQuickOpen(false)}
                                  className={cn(
                                    "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] transition-colors",
                                    a.disabled
                                      ? "cursor-not-allowed text-[#b4b8bf]"
                                      : "text-[#4c535c] hover:bg-[#f6f7f9] hover:text-[#0f1419]",
                                  )}
                                >
                                  <Icon className="h-4 w-4" />
                                  {a.label}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                {/* success banner */}
                {done && (
                  <div className="mb-2.5 inline-flex w-fit items-center gap-1.5 rounded-lg bg-[#e8f8ee] px-2.5 py-1.5 text-xs font-medium text-[#1a9d54]">
                    <CheckCircle2 className="h-4 w-4" />1 个提取任务已完成，快来查看吧！
                  </div>
                )}

                <div className="h-[132px] w-full overflow-y-auto rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 no-scrollbar">
                  {result ? (
                    <p className="whitespace-pre-wrap text-[#1f2937]">{result}</p>
                  ) : (
                    <p className="text-[#b4b8bf]">提取后的文案会出现在这里，也可以直接粘贴整理好的内容。</p>
                  )}
                </div>
              </div>

              {/* Progress card */}
              {extracting && (
                <div className="rounded-2xl border border-[#0471FE]/20 bg-[#0471FE]/[0.04] px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-sm font-medium text-[#0f1419]">
                      <Loader2 className="h-4 w-4 animate-spin text-[#0471FE]" />
                      {current.short}处理中，正在努力提取可用文案
                    </span>
                    <span className="text-sm font-semibold tabular-nums text-[#0471FE]">{progress}%</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#0471FE]/15">
                    <div
                      className="h-full rounded-full bg-[#0471FE] transition-all duration-200 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-[#8a9099]">已等待 {elapsed} 秒</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultAction({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      type="button"
      className="inline-flex h-7 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-[#4c535c] transition-colors hover:bg-slate-50 hover:text-[#0f1419]"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
