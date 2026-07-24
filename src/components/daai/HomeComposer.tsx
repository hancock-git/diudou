"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  CheckCircle2,
  ChevronDown,
  Clapperboard,
  Clock,
  Copy,
  Download,
  FileCheck2,
  FolderPlus,
  Image as ImageIcon,
  LayoutPanelLeft,
  Link2,
  Loader2,
  Mic,
  Music,
  Play,
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
    label: "链接提取",
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
type LinkExtractType = "copy" | "video";

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
  const [linkExtractType, setLinkExtractType] = useState<LinkExtractType>("copy");
  const [value, setValue] = useState("");
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [doneSeconds, setDoneSeconds] = useState<number | null>(null);
  const [quickOpen, setQuickOpen] = useState(false);
  const [videoPreviewOpen, setVideoPreviewOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);
  const quickRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const current = TABS.find((t) => t.key === tab)!;
  const isFile = current.kind === "file";
  const canExtract = isFile ? fileName.length > 0 : value.trim().length > 0;
  const done = !extracting && result.length > 0;
  const isVideoLinkResult = tab === "link" && linkExtractType === "video" && done;

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
    setDoneSeconds(null);
    setQuickOpen(false);
    setVideoPreviewOpen(false);
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

    const startTime = Date.now();
    let p = 0;
    timerRef.current = window.setInterval(() => {
      p = Math.min(100, p + 7);
      const secs = Math.floor((Date.now() - startTime) / 1000);
      setProgress(p);
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
      <div className="relative z-[1] mx-auto flex w-full max-w-[1240px] flex-col items-center pt-9">
        {/* blue radial wash behind the title */}
        <div className="pointer-events-none absolute left-1/2 top-0 z-0 h-[210px] w-full max-w-[860px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_50%_100%_at_center_8%,#fdfcfc_0%,#9dd2ff_50%,rgba(157,210,255,0)_78%)] blur-[98px]" />

        {/* Title */}
        <div className="relative z-[1]">
          <h1 className="flex flex-col items-center text-center not-italic">
            <span className="bg-gradient-to-r from-[#0A6CFF] via-[#7C3AED] to-[#FF3D8B] bg-clip-text text-[30px] font-extrabold leading-[1.18] text-transparent sm:text-[42px]">
              想法丢给我，爆款抖给你
            </span>
            <span className="mt-3 text-[16px] font-semibold leading-6 tracking-[0.08em] text-[#1f2937] sm:text-[20px] sm:leading-7">
              丢抖 · 电商内容智能创作平台
            </span>
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
          <div className="mt-4 grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2">
            {/* Left: input */}
            <div className="flex flex-col rounded-2xl border border-slate-200 bg-[#f8fafc] p-3">
              <div className="mb-2.5 flex items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <label className="text-sm font-semibold text-[#0f1419]">{current.label}</label>
                  {tab === "link" && (
                    <div className="inline-flex rounded-lg bg-white p-0.5 shadow-[0_0_0_1px_rgba(226,232,240,1)]">
                      {[
                        { key: "copy", label: "提取文案" },
                        { key: "video", label: "提取视频" },
                      ].map((item) => (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => {
                            setLinkExtractType(item.key as LinkExtractType);
                            setResult("");
                            setCopied(false);
                            setDoneSeconds(null);
                            setQuickOpen(false);
                          }}
                          className={cn(
                            "h-7 rounded-md px-2.5 text-xs font-semibold transition-all",
                            linkExtractType === item.key
                              ? "bg-[#0471FE] text-white shadow-sm"
                              : "text-[#8a9099] hover:text-[#0f1419]",
                          )}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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

            {/* Right: result */}
            <div className="flex flex-col rounded-2xl border border-slate-200 bg-[#f8fafc] p-3">
                <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                  <label className="shrink-0 text-sm font-semibold text-[#0f1419]">
                    {isVideoLinkResult ? "视频资源" : `提取结果（${current.short}）`}
                  </label>
                  <div className="flex flex-wrap items-center justify-end gap-1.5">
                    {!isVideoLinkResult && done && (
                      <span className="inline-flex h-7 items-center gap-1 rounded-lg bg-[#e8f8ee] px-2 text-xs font-medium text-[#1a9d54]">
                        <CheckCircle2 className="h-3.5 w-3.5" />1 个提取任务已完成
                      </span>
                    )}
                    {!isVideoLinkResult && done && doneSeconds !== null && (
                      <span className="inline-flex h-7 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-xs font-medium text-[#8a9099]">
                        <Clock className="h-3.5 w-3.5" />
                        本次提取仅用时 {doneSeconds} 秒
                      </span>
                    )}
                    {!isVideoLinkResult && (
                      <>
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
                      </>
                    )}

                    {/* 快速成片 dropdown */}
                    {!isVideoLinkResult && <div ref={quickRef} className="relative">
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
                    </div>}
                  </div>
                </div>

                {/* success banner moved to title row right side */}

                {isVideoLinkResult ? (
                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <div className="grid min-h-[132px] grid-cols-[188px_minmax(0,1fr)_172px] max-lg:grid-cols-[188px_minmax(0,1fr)] max-sm:grid-cols-1">
                      <button
                        type="button"
                        onClick={() => setVideoPreviewOpen(true)}
                        className="group relative min-h-[132px] overflow-hidden bg-[#0f172a]"
                        aria-label="播放视频"
                      >
                        <div className="absolute left-3 top-3 rounded-md bg-black px-2 py-1 text-[11px] font-bold text-white">
                          B站
                        </div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_28%,rgba(4,113,254,0.35),transparent_34%),linear-gradient(135deg,#101827,#0b1120)]" />
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/92 text-[#0471FE] shadow-[0_12px_30px_rgba(0,0,0,0.25)] transition-transform group-hover:scale-110">
                            <Play className="ml-0.5 h-5 w-5 fill-current" />
                          </span>
                        </span>
                      </button>
                      <div className="flex min-w-0 flex-col justify-center px-4 py-3">
                        <h3 className="truncate text-[15px] font-bold text-[#0f1419]">
                          同习主席会见时，哈萨克斯坦总统用中文表达感谢与祝贺
                        </h3>
                        <div className="mt-2 flex flex-wrap items-center gap-5 text-sm font-medium text-[#64748b]">
                          <span>时长：0:39</span>
                          <span>大小：4.1 MB</span>
                        </div>
                        <span className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#e9fbf2] px-2.5 py-1 text-xs font-bold text-[#12a36a]">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          已提取平台原始视频源
                        </span>
                      </div>
                      <div className="flex items-center justify-center border-l border-slate-200 px-4 py-3 max-lg:col-span-2 max-lg:border-l-0 max-lg:border-t max-sm:col-span-1">
                        <button
                          type="button"
                          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1F63F6] px-4 text-sm font-bold text-white shadow-[0_12px_24px_rgba(31,99,246,0.25)] transition-colors hover:bg-[#1554de]"
                        >
                          <Download className="h-4 w-4" />
                          保存视频
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-[132px] w-full overflow-y-auto rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 no-scrollbar">
                    {result ? (
                    <p className="whitespace-pre-wrap text-[#1f2937]">{result}</p>
                    ) : (
                    <p className="text-[#b4b8bf]">提取后的文案会出现在这里，也可以直接粘贴整理好的内容。</p>
                    )}
                  </div>
                )}

                {/* Progress bar inside card for height consistency */}
                {extracting && (
                  <div className="mt-2.5 flex items-center gap-2 rounded-lg bg-[#0471FE]/[0.04] px-3 py-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#0471FE]" />
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#0471FE]/15">
                      <div
                        className="h-full rounded-full bg-[#0471FE] transition-all duration-200 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold tabular-nums text-[#0471FE]">{progress}%</span>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
      {videoPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-[#080d18] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-white">视频预览</div>
                <div className="mt-0.5 truncate text-xs text-white/55">同习主席会见时，哈萨克斯坦总统用中文表达感谢与祝贺</div>
              </div>
              <button
                type="button"
                onClick={() => setVideoPreviewOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="关闭视频预览"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="relative aspect-video bg-black">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(4,113,254,0.30),transparent_34%),linear-gradient(135deg,#0f172a,#020617)]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#0471FE]">
                  <Play className="ml-1 h-7 w-7 fill-current" />
                </span>
                <span className="mt-4 text-sm font-semibold text-white/75">静态预览效果</span>
              </div>
            </div>
          </div>
        </div>
      )}
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
