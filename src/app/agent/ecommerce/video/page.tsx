"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Bookmark,
  ChevronRight,
  Clock,
  Eye,
  FolderOpen,
  Heart,
  Loader2,
  Maximize2,
  Plus,
  Sparkles,
  Video as VideoIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TaskStatus = "done" | "generating" | "failed" | "queued";

interface QueueTask {
  id: string;
  description: string;
  status: TaskStatus;
  poster: string | null;
}

const QUEUE_TASKS: QueueTask[] = [
  {
    id: "t1",
    description:
      "高清足球比赛现场电视转播实拍画面，氛围感十足，拥挤热闹的看台，摇臂镜头缓慢推进，球员奔跑传球…",
    status: "done",
    poster: "/images/posters/poster-01.jpg",
  },
  {
    id: "t2",
    description:
      "高清足球比赛现场电视转播实拍画面，氛围感十足，拥挤热闹的看台，慢镜头特写守门员起跳扑救…",
    status: "done",
    poster: "/images/posters/poster-02.jpg",
  },
  {
    id: "t3",
    description: "生成一个威化饼干的视频",
    status: "done",
    poster: "/images/posters/poster-04.jpg",
  },
  {
    id: "t4",
    description:
      "中景镜头，女性手指自然拿起沪上阿姨香浓可可小方威化饼干盒，展示包装正面 logo 与产品卖点…",
    status: "done",
    poster: "/images/posters/poster-03.png",
  },
  {
    id: "t5",
    description:
      "中景镜头，女性手指自然拿起沪上阿姨香浓可可小方威化饼干盒，缓慢旋转展示侧面配料表…",
    status: "done",
    poster: "/images/posters/poster-04.jpg",
  },
  {
    id: "t6",
    description:
      "画面中央，一个 185 大帅哥，手拿起沪上阿姨香浓可可小方威化饼干，正面镜头咬一口…",
    status: "failed",
    poster: null,
  },
  {
    id: "t7",
    description:
      "真实电商口播信息流短视频，9:16 竖屏。办公室工位场景，白领女性对镜口播产品卖点…",
    status: "done",
    poster: "/images/posters/poster-05.png",
  },
  {
    id: "t8",
    description:
      "真实电商口播信息流短视频，9:16 竖屏，居家场景，妈妈手拿产品对着镜头介绍卖点…",
    status: "done",
    poster: "/images/posters/poster-06.png",
  },
  {
    id: "t9",
    description: "根据素材生成商品带货视频，突出主图卖点与场景使用画面",
    status: "done",
    poster: "/images/posters/poster-01.jpg",
  },
];

const STATUS_META: Record<
  TaskStatus,
  { label: string; chipCls: string; cornerCls: string; icon?: React.ReactNode }
> = {
  done: {
    label: "已完成",
    chipCls: "bg-emerald-50 text-emerald-600 border-emerald-100",
    cornerCls: "bg-emerald-500 text-white",
  },
  generating: {
    label: "生成中",
    chipCls: "bg-amber-50 text-amber-600 border-amber-100",
    cornerCls: "bg-amber-500 text-white",
  },
  failed: {
    label: "失败",
    chipCls: "bg-rose-50 text-rose-600 border-rose-100",
    cornerCls: "bg-rose-500 text-white",
  },
  queued: {
    label: "排队中",
    chipCls: "bg-slate-100 text-slate-500 border-slate-200",
    cornerCls: "bg-slate-400 text-white",
  },
};

export default function VideoPage() {
  const [prompt, setPrompt] = useState("");
  const [queueOpen, setQueueOpen] = useState(true);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  const queuedCount = 7;
  const generatingCount = 0;

  return (
    <div
      className={cn(
        "grid gap-4",
        queueOpen ? "lg:grid-cols-[minmax(0,1fr)_360px]" : "lg:grid-cols-1",
      )}
    >
      {/* LEFT: composer */}
      <div className="flex min-w-0 flex-col gap-4">
        {/* Title row */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-950">AI 视频</h1>
          <button
            type="button"
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            <Plus className="h-4 w-4" />
            新建
          </button>
        </div>

        {/* Usage chip */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
            0 / 15
          </span>
        </div>

        {/* Composer card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 text-xs font-medium text-slate-600 transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
            >
              <Plus className="h-3.5 w-3.5" />
              选择素材
            </button>
            <button
              type="button"
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              <FolderOpen className="h-3.5 w-3.5" />
              打开资产库
            </button>
            <button
              type="button"
              className="ml-auto inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              展开编辑区
            </button>
          </div>

          <div className="mt-3 flex items-start gap-3">
            <button
              type="button"
              aria-label="选择素材"
              className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-slate-500 transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
            >
              <Plus className="h-4 w-4" />
              <span className="mt-0.5 text-[10px]">选择素材</span>
            </button>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="上传、拖入或粘贴参考素材并输入文字，或使用 @ 引用已添加的素材。可自由组合图、文、音、视频。例如 @图片1 模仿 @视频1 的动作，音色参考 @音频1。"
              className="min-h-[140px] w-full flex-1 resize-y rounded-xl border border-slate-200 bg-white p-3 text-sm leading-6 text-slate-800 outline-none placeholder:text-slate-400 focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>{prompt.length} / 2000</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled
                className="inline-flex h-7 items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 text-[11px] font-medium text-slate-400 opacity-60"
              >
                <Sparkles className="h-3.5 w-3.5" />
                优化当前 AI 视频提示词
              </button>
              <button
                type="button"
                className="inline-flex h-7 items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 text-[11px] font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                <Sparkles className="h-3.5 w-3.5" />
                帮我写
              </button>
            </div>
          </div>

          {/* Settings footer */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                <span className="text-slate-400">模型</span>
                <span className="font-medium text-slate-800">
                  Seedance-2.0-VIP
                </span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                <span className="text-slate-400">视频设置</span>
                <span className="font-medium text-slate-800">
                  9:16 · 720p · 15s
                </span>
              </span>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary/90 active:translate-y-px"
              >
                <VideoIcon className="h-4 w-4" />
                立即生成视频
              </button>
              <span className="text-[11px] text-slate-400">预计 300.00 积分</span>
            </div>
          </div>
        </div>

        {/* Preview area */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="font-medium text-slate-700">预览</span>
              <span className="text-slate-300">·</span>
              <span>收藏</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-7 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                <Eye className="h-3.5 w-3.5" />
                预览
              </button>
              <button
                type="button"
                className="inline-flex h-7 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                <Heart className="h-3.5 w-3.5" />
                收藏
              </button>
            </div>
          </div>

          <div className="mt-4 flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
              <VideoIcon className="h-5 w-5" />
            </div>
            <p className="max-w-xs text-sm text-slate-500">
              点击右侧队列中带成片的任务即可预览。
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT: task queue */}
      {queueOpen ? (
        <aside className="flex min-w-0 flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-950">任务队列</h2>
            <button
              type="button"
              onClick={() => setQueueOpen(false)}
              className="inline-flex h-7 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              收起
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <StatPill
              tone="blue"
              label="排队中"
              value={queuedCount}
            />
            <StatPill
              tone="slate"
              label="生成中"
              value={generatingCount}
            />
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {QUEUE_TASKS.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                active={task.id === activeTaskId}
                onSelect={() => setActiveTaskId(task.id)}
              />
            ))}
          </div>
        </aside>
      ) : (
        <button
          type="button"
          onClick={() => setQueueOpen(true)}
          className="fixed right-4 top-24 inline-flex h-9 items-center gap-1 rounded-full border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50 lg:top-28"
        >
          <Bookmark className="h-3.5 w-3.5" />
          任务队列
        </button>
      )}
    </div>
  );
}

interface StatPillProps {
  label: string;
  value: number;
  tone: "blue" | "slate";
}

function StatPill({ label, value, tone }: StatPillProps) {
  const toneCls =
    tone === "blue"
      ? "bg-primary/5 text-primary border-primary/10"
      : "bg-slate-100 text-slate-600 border-slate-200";

  return (
    <div
      className={cn(
        "flex flex-col gap-0.5 rounded-xl border px-3 py-2 text-xs",
        toneCls,
      )}
    >
      <span className="opacity-80">{label}</span>
      <span className="text-xl font-semibold leading-tight">{value}</span>
    </div>
  );
}

interface TaskCardProps {
  task: QueueTask;
  active: boolean;
  onSelect: () => void;
}

function TaskCard({ task, active, onSelect }: TaskCardProps) {
  const meta = STATUS_META[task.status];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group block w-full overflow-hidden rounded-xl border bg-white text-left shadow-sm transition-all",
        active
          ? "border-primary/40 ring-2 ring-primary/15"
          : "border-slate-200 hover:border-slate-300 hover:shadow",
      )}
    >
      <div className="relative aspect-video w-full bg-slate-100">
        {task.poster ? (
          <Image
            src={task.poster}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 320px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
            <VideoIcon className="h-6 w-6" />
          </div>
        )}

        {/* Status corner chip */}
        <span
          className={cn(
            "absolute right-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold shadow-sm",
            meta.cornerCls,
          )}
        >
          {task.status === "generating" ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : task.status === "queued" ? (
            <Clock className="h-3 w-3" />
          ) : null}
          {meta.label}
        </span>
      </div>

      <div className="space-y-2 p-3">
        <p className="line-clamp-2 text-xs leading-5 text-slate-700">
          {task.description}
        </p>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium",
            meta.chipCls,
          )}
        >
          {meta.label}
        </span>
      </div>
    </button>
  );
}
