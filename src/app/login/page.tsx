"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Bot,
  ChevronRight,
  ImageIcon,
  Lock,
  Play,
  Sparkles,
  Video,
  Wand2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type LoginTab = "account" | "phone";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<LoginTab>("account");
  const [account, setAccount] = useState("admin");
  const [password, setPassword] = useState("");

  const canSubmit = password.trim().length > 0;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    router.push("/agent/ecommerce/home");
  };

  return (
    <div className="min-h-dvh bg-gradient-to-br from-slate-100 via-white to-slate-100 flex items-center justify-center px-4 py-10">
      <div className="mx-auto my-auto flex h-[600px] w-full max-w-[960px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        {/* Left column — brand hero */}
        <div className="relative hidden w-[55%] flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-8 md:flex">
          {/* Radial glow overlays */}
          <div
            className="pointer-events-none absolute -left-16 -top-24 h-72 w-72 rounded-full opacity-40 blur-3xl"
            style={{
              background:
                "radial-gradient(circle at center, #0471fe 0%, transparent 70%)",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-24 right-0 h-80 w-80 rounded-full opacity-30 blur-3xl"
            style={{
              background:
                "radial-gradient(circle at center, #7c3aed 0%, transparent 70%)",
            }}
            aria-hidden
          />

          {/* Top preview card */}
          <div className="relative z-10 w-[340px] max-w-full rounded-2xl border border-white/10 bg-slate-800/70 p-4 text-white shadow-xl backdrop-blur">
            {/* Header row */}
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, #0471fe 0%, #4f8cff 100%)",
                  boxShadow: "0 8px 24px rgba(4, 113, 254, 0.45)",
                }}
              >
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-white">
                  智能带货工作台
                </div>
                <div className="mt-0.5 truncate text-[11px] text-white/60">
                  素材 · 文案 · 分镜 · 成片
                </div>
              </div>
              <span className="inline-flex h-5 shrink-0 items-center gap-1 rounded-full bg-red-500/90 px-2 text-[10px] font-semibold uppercase tracking-wide text-white">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                Live
              </span>
            </div>

            {/* Mock rows */}
            <div className="mt-4 space-y-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-white/80" />
                <span className="text-[11px] text-white/80">AI 文案提炼</span>
                <div className="ml-auto flex items-center gap-2">
                  <div className="h-1 w-16 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: "92%" }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold tabular-nums text-white">
                    92%
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Video className="h-3.5 w-3.5 text-white/80" />
                <span className="text-[11px] text-white/80">
                  生成 9:16 带货短视频
                </span>
                <span className="ml-auto inline-flex h-5 items-center gap-1 rounded-full bg-white/10 px-2 text-[10px] text-white">
                  <Play className="h-2.5 w-2.5 fill-white" />
                  预览
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Wand2 className="h-3.5 w-3.5 text-white/80" />
                <span className="text-[11px] text-white/80">分镜时间线</span>
                <span className="ml-auto text-[11px] font-semibold tabular-nums text-white">
                  15s
                </span>
              </div>

              <div className="flex items-center gap-2">
                <ImageIcon className="h-3.5 w-3.5 text-white/80" />
                <span className="text-[11px] text-white/80">商品图识别</span>
                <span className="ml-auto text-[11px] font-semibold text-white">
                  卖点 6 个
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Play className="h-3.5 w-3.5 text-white/80" />
                <span className="text-[11px] text-white/80">成片预览</span>
                <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-white">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  自动生成中
                </span>
              </div>
            </div>
          </div>

          {/* Bottom text block */}
          <div className="relative z-10 space-y-3">
            <span className="inline-flex h-6 items-center rounded-full border border-white/20 bg-white/10 px-3 text-[11px] text-white/80">
              AI 电商内容工作台
            </span>
            <h1 className="text-3xl font-bold text-white">
              丢抖AI电商智能体助手
            </h1>
            <p className="max-w-sm text-sm text-white/70">
              从商品素材、文案提炼到分镜视频生成，一站式完成带货内容生产。
            </p>
          </div>
        </div>

        {/* Right column — form */}
        <div className="relative flex w-full flex-col p-10 md:w-[45%]">
          {/* Close */}
          <Link
            href="/"
            aria-label="关闭"
            className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </Link>

          {/* Chip */}
          <span className="inline-flex h-6 w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 text-[11px] text-primary">
            <Lock className="h-3 w-3" />
            安全账号中心
          </span>

          <h2 className="mt-4 text-2xl font-semibold text-slate-950">
            欢迎回来
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            登录后继续使用你的工作台和资产库。
          </p>

          {/* Tabs */}
          <div className="mt-6 grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1">
            {[
              { key: "account" as const, label: "账号登录" },
              { key: "phone" as const, label: "手机号注册" },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={cn(
                  "h-9 rounded-md text-sm font-medium transition-all",
                  tab === t.key
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500 hover:text-slate-700",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <input
              type="text"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              placeholder="账号 / 手机号 / 邮箱"
              className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              className="h-11 w-full rounded-lg border border-slate-200 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              disabled={!canSubmit}
              className={cn(
                "inline-flex h-11 w-full items-center justify-center gap-1 rounded-lg text-sm font-medium transition-colors",
                canSubmit
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "cursor-not-allowed bg-primary/40 text-white",
              )}
            >
              登录
              <ChevronRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-auto pt-6 text-[11px] leading-5 text-slate-400">
            手机号注册后可直接用手机号和密码登录。邀请码只能使用一次，请勿在公开环境保存账号密钥。
          </p>
        </div>
      </div>
    </div>
  );
}
