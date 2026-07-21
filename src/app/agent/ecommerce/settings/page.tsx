"use client";

import { useState } from "react";
import {
  Sparkles,
  Video,
  ImagePlus,
  CheckCircle2,
  ArrowUpRight,
  FileText,
  UserCircle,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ---- Mock data ----

type QuickKey = "video" | "image" | "credits";

const QUICK_ENTRIES: {
  key: QuickKey;
  title: string;
  description: string;
  icon: typeof Video;
}[] = [
  {
    key: "video",
    title: "开始生成视频",
    description: "使用当前模型和默认规格创建任务",
    icon: Video,
  },
  {
    key: "image",
    title: "生成商品图片",
    description: "进入 AI 生图工作台创建首帧和素材",
    icon: ImagePlus,
  },
  {
    key: "credits",
    title: "查看积分记录",
    description: "核对充值、消耗、退款与当前余额",
    icon: FileText,
  },
];

const CONFIG_STATUS = [
  {
    key: "video",
    label: "视频生成模型",
    value: "Seedance-2.0-VIP",
  },
  {
    key: "image",
    label: "图片生成模型",
    value: "gpt-image-2",
  },
  {
    key: "output",
    label: "输出规格",
    value: "720p · 9:16",
  },
];

// ---- Sub-components ----

function DefaultChip() {
  return (
    <span className="inline-flex h-5 items-center rounded-full bg-primary/10 px-2 text-[10px] font-semibold text-primary">
      默认
    </span>
  );
}

function Breadcrumb() {
  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-500">
      <span>账户中心</span>
      <span className="text-slate-300">/</span>
      <span className="text-slate-700">模型与生成</span>
    </div>
  );
}

// ---- Page ----

export default function SettingsPage() {
  const [selectedQuick, setSelectedQuick] = useState<QuickKey | null>(null);

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Header row */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold text-slate-950">
                模型与生成设置
              </h1>
              <span className="inline-flex h-6 items-center gap-1 rounded-full bg-primary/10 px-2.5 text-xs font-semibold text-primary">
                <CheckCircle2 className="h-3.5 w-3.5" />
                默认配置已就绪
              </span>
            </div>
            <p className="max-w-3xl text-sm text-slate-500">
              集中查看工作台默认使用的图片模型、视频模型和输出规格，生成单次任务时仍可临时调整。
            </p>
          </div>

          {/* Right side cards */}
          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center lg:flex-nowrap">
            <div className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 shadow-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UserCircle className="h-4 w-4" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] font-medium text-primary">
                  管理员
                </span>
                <span className="text-sm font-semibold text-slate-950">
                  管理员账号
                </span>
              </div>
            </div>

            <button
              type="button"
              className="inline-flex h-12 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <Video className="h-4 w-4" />
              进入视频生成
            </button>

            <button
              type="button"
              className="inline-flex h-12 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
            >
              管理完整配置
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main content 2-column layout */}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4">
          {/* 当前默认模型 */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-950">
                  当前默认模型
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  创建新任务时自动选中，点击卡片可进入对应生成工作台。
                </p>
              </div>
              <span className="inline-flex h-6 items-center rounded-full bg-slate-100 px-2.5 text-xs font-medium text-slate-600">
                丢抖AI 推荐方案
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {/* Video model card */}
              <button
                type="button"
                className="group rounded-xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Video className="h-4 w-4" />
                  </div>
                  <DefaultChip />
                </div>
                <div className="mt-3 text-xs font-medium text-slate-500">
                  默认视频模型
                </div>
                <div className="mt-1 text-lg font-semibold text-slate-950">
                  Seedance-2.0-VIP
                </div>
                <div className="mt-1 text-xs text-slate-400">
                  doubao-seedance-2-0-260128
                </div>
                <div className="mt-3 text-xs text-slate-500">
                  负责商品视频与带货短片生成
                </div>
              </button>

              {/* Image model card */}
              <button
                type="button"
                className="group rounded-xl border border-slate-200 bg-white p-4 text-left transition-all hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <ImagePlus className="h-4 w-4" />
                  </div>
                  <DefaultChip />
                </div>
                <div className="mt-3 text-xs font-medium text-slate-500">
                  默认图片模型
                </div>
                <div className="mt-1 text-lg font-semibold text-slate-950">
                  gpt-image-2
                </div>
                <div className="mt-1 text-xs text-slate-400">gpt-image-2</div>
                <div className="mt-3 text-xs text-slate-500">
                  用于首帧、商品图与参考素材生成
                </div>
              </button>
            </div>
          </section>

          {/* 默认视频规格 */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-950">
                  默认视频规格
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  新建视频任务时自动应用，单次生成可在视频工作台临时覆盖。
                </p>
              </div>
              <button
                type="button"
                className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                去调整本次任务
                <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <div className="text-xs font-medium text-slate-500">清晰度</div>
                <div className="mt-2 text-2xl font-semibold text-slate-950">
                  720p
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  默认输出分辨率
                </div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <div className="text-xs font-medium text-slate-500">
                  画面比例
                </div>
                <div className="mt-2 text-2xl font-semibold text-slate-950">
                  9:16
                </div>
                <div className="mt-1 text-xs text-slate-500">竖屏短视频</div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-lg bg-primary/5 px-3 py-2 text-xs text-primary">
              <CheckCircle2 className="h-3.5 w-3.5" />
              当前工作台与默认设置一致
            </div>

            <div className="mt-3 flex flex-col gap-1 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <span>当前工作台：720p · 9:16</span>
              <span>默认：720p · 9:16</span>
            </div>
          </section>

          {/* 配置状态 */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-slate-950">配置状态</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {CONFIG_STATUS.map((item) => (
                <div
                  key={item.key}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"
                >
                  <div className="text-xs font-medium text-slate-500">
                    {item.label}
                  </div>
                  <div className="mt-2 text-sm font-semibold text-slate-950">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-xs text-slate-500">
              你可以进入完整配置管理模型、密钥与平台级参数。
            </div>
          </section>

          {/* 快捷入口 */}
          <section
            aria-label="快捷入口"
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-base font-semibold text-slate-950">快捷入口</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {QUICK_ENTRIES.map((entry) => {
                const Icon = entry.icon;
                const isActive = selectedQuick === entry.key;
                return (
                  <button
                    key={entry.key}
                    type="button"
                    onClick={() =>
                      setSelectedQuick(isActive ? null : entry.key)
                    }
                    className={cn(
                      "flex items-start gap-3 rounded-xl border p-4 text-left transition-all",
                      isActive
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-slate-200 bg-white hover:bg-slate-50",
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        isActive
                          ? "bg-primary text-white"
                          : "bg-primary/10 text-primary",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-slate-950">
                        {entry.title}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {entry.description}
                      </div>
                    </div>
                    <ArrowUpRight
                      className={cn(
                        "h-4 w-4 shrink-0",
                        isActive ? "text-primary" : "text-slate-400",
                      )}
                    />
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="text-sm font-semibold text-slate-950">
                账户余额
              </div>
            </div>

            <div className="mt-4 text-4xl font-semibold text-slate-950">
              无限
            </div>
            <div className="mt-1 text-xs text-slate-500">可用积分</div>

            <p className="mt-4 text-xs text-slate-500">
              查看和保存配置不会消耗积分，只有执行图片或视频生成任务时才会扣除。
            </p>

            <button
              type="button"
              className="mt-4 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-primary text-sm font-semibold text-white hover:bg-primary/90"
            >
              <Wand2 className="h-4 w-4" />
              查看积分与消耗
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
