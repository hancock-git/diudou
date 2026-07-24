"use client";

import { useMemo, useState } from "react";
import {
  CircleAlert,
  FileImage,
  FileVideo,
  Receipt,
  RefreshCw,
  TicketCheck,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

type TxType = "consume" | "refund" | "topup" | "expire";
type Tool =
  | "video-gen"
  | "image-gen"
  | "video-cut"
  | "subtitle-erase"
  | "quality-boost"
  | "prompt-gen"
  | "other";

interface Transaction {
  id: string;
  title: string;
  type: TxType;
  tool: Tool;
  toolLabel: string;
  date: string;
  amount: number;
  balance: number;
  refund?: boolean;
}

const TX: Transaction[] = [
  {
    id: "1",
    title: "云端 Seedance 视频生成完成",
    type: "consume",
    tool: "video-gen",
    toolLabel: "视频生成",
    date: "07/10 16:37",
    amount: 0,
    balance: 100_000,
  },
  {
    id: "2",
    title: "视频生成任务冻结积分",
    type: "consume",
    tool: "image-gen",
    toolLabel: "图片生成",
    date: "07/10 16:31",
    amount: 0,
    balance: 100_000,
  },
  {
    id: "3",
    title: "云端 Seedance 视频生成完成",
    type: "consume",
    tool: "video-gen",
    toolLabel: "视频生成",
    date: "07/09 22:31",
    amount: 0,
    balance: 100_000,
  },
  {
    id: "4",
    title: "视频生成任务冻结积分",
    type: "consume",
    tool: "image-gen",
    toolLabel: "图片生成",
    date: "07/09 22:27",
    amount: 0,
    balance: 100_000,
  },
  {
    id: "5",
    title: "云端 Seedance 视频生成完成",
    type: "consume",
    tool: "video-gen",
    toolLabel: "视频生成",
    date: "07/09 17:01",
    amount: 0,
    balance: 100_000,
  },
  {
    id: "6",
    title: "云端 Seedance 视频生成完成",
    type: "consume",
    tool: "video-gen",
    toolLabel: "视频生成",
    date: "07/09 16:59",
    amount: 0,
    balance: 100_000,
  },
  {
    id: "7",
    title: "视频生成任务冻结积分",
    type: "consume",
    tool: "image-gen",
    toolLabel: "图片生成",
    date: "07/09 16:58",
    amount: 0,
    balance: 100_000,
  },
  {
    id: "8",
    title: "视频生成任务冻结积分",
    type: "consume",
    tool: "image-gen",
    toolLabel: "图片生成",
    date: "07/09 16:54",
    amount: 0,
    balance: 100_000,
  },
  {
    id: "9",
    title: "云端 Seedance 视频生成完成",
    type: "consume",
    tool: "video-gen",
    toolLabel: "视频生成",
    date: "07/09 16:49",
    amount: 0,
    balance: 100_000,
  },
  {
    id: "10",
    title: "视频生成任务冻结积分",
    type: "consume",
    tool: "image-gen",
    toolLabel: "图片生成",
    date: "07/09 16:45",
    amount: 0,
    balance: 100_000,
  },
  {
    id: "11",
    title: "视频生成失败，请调整素材或参数后重试",
    type: "refund",
    tool: "video-gen",
    toolLabel: "视频生成",
    date: "07/09 16:38",
    amount: 0,
    balance: 100_000,
    refund: true,
  },
  {
    id: "12",
    title: "视频生成任务冻结积分",
    type: "consume",
    tool: "image-gen",
    toolLabel: "图片生成",
    date: "07/09 16:34",
    amount: 0,
    balance: 100_000,
  },
  {
    id: "13",
    title: "视频任务提交失败，自动退回冻结积分",
    type: "refund",
    tool: "video-gen",
    toolLabel: "视频生成",
    date: "07/09 16:21",
    amount: 0,
    balance: 100_000,
    refund: true,
  },
  {
    id: "14",
    title: "视频生成任务冻结积分",
    type: "consume",
    tool: "image-gen",
    toolLabel: "图片生成",
    date: "07/09 15:05",
    amount: 0,
    balance: 100_000,
  },
  {
    id: "15",
    title: "云端 Seedance 视频生成完成",
    type: "consume",
    tool: "video-gen",
    toolLabel: "视频生成",
    date: "07/08 14:45",
    amount: 0,
    balance: 100_000,
  },
  {
    id: "16",
    title: "云端 Seedance 视频生成完成",
    type: "consume",
    tool: "video-gen",
    toolLabel: "视频生成",
    date: "07/07 13:24",
    amount: 0,
    balance: 100_000,
  },
  {
    id: "17",
    title: "视频任务提交失败，自动退回冻结积分",
    type: "refund",
    tool: "video-gen",
    toolLabel: "视频生成",
    date: "07/07 12:32",
    amount: 0,
    balance: 100_000,
    refund: true,
  },
  {
    id: "18",
    title: "云端 Seedance 视频生成完成",
    type: "consume",
    tool: "video-gen",
    toolLabel: "视频生成",
    date: "06/26 20:17",
    amount: 0,
    balance: 100_000,
  },
  {
    id: "19",
    title: "视频生成任务冻结积分",
    type: "consume",
    tool: "image-gen",
    toolLabel: "图片生成",
    date: "06/26 20:12",
    amount: 0,
    balance: 100_000,
  },
  {
    id: "20",
    title: "系统初始化管理员积分",
    type: "topup",
    tool: "other",
    toolLabel: "其他",
    date: "06/12 11:39",
    amount: 100_000,
    balance: 100_000,
  },
];

const TYPE_FILTERS: { key: "all" | TxType; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "consume", label: "消费" },
  { key: "refund", label: "退款" },
  { key: "topup", label: "积分充值" },
  { key: "expire", label: "过期" },
];

const TOOL_FILTERS: { key: "all" | Tool; label: string }[] = [
  { key: "all", label: "全部工具" },
  { key: "video-gen", label: "视频生成" },
  { key: "image-gen", label: "图片生成" },
  { key: "video-cut", label: "视频拆条" },
  { key: "subtitle-erase", label: "字幕擦除" },
  { key: "quality-boost", label: "画质增强" },
  { key: "prompt-gen", label: "提示词生成" },
];

export default function CreditsPage() {
  const [typeFilter, setTypeFilter] = useState<"all" | TxType>("all");
  const [toolFilter, setToolFilter] = useState<"all" | Tool>("all");

  const filtered = useMemo(
    () =>
      TX.filter((t) => (typeFilter === "all" ? true : t.type === typeFilter)).filter(
        (t) => (toolFilter === "all" ? true : t.tool === toolFilter),
      ),
    [typeFilter, toolFilter],
  );

  return (
    <div className="space-y-4">
      {/* Title row */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          我的积分
        </h1>
        <button
          type="button"
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 shadow-sm transition-colors hover:bg-slate-50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          刷新
        </button>
      </div>

      {/* Balance overview card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-sm text-slate-500">可用积分</div>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="text-5xl font-semibold tracking-tight text-slate-950">
                无限
              </span>
              <span className="text-xs text-slate-400">
                = 订阅积分 0.00 + 充值积分 无限
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-6">
            <MiniStat label="订阅积分" value="0.00" meta="-" />
            <MiniStat label="充值积分" value="无限" meta="-" />
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
              >
                <TicketCheck className="h-4 w-4" />
                兑换充值卡
              </button>
              <button
                type="button"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-slate-950 px-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800"
              >
                <Wallet className="h-4 w-4" />
                订阅 / 充值
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Details card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-slate-950">积分明细</h2>
          <button
            type="button"
            className="inline-flex h-7 items-center gap-1 text-xs font-medium text-slate-600 transition-colors hover:text-primary"
          >
            <Receipt className="h-3.5 w-3.5" />
            发票管理
            <span className="ml-0.5 text-slate-400">›</span>
          </button>
        </div>

        {/* Filter rows */}
        <div className="mt-4 space-y-3">
          <FilterRow label="类型">
            {TYPE_FILTERS.map((f) => (
              <FilterPill
                key={f.key}
                active={typeFilter === f.key}
                onClick={() => setTypeFilter(f.key)}
              >
                {f.label}
              </FilterPill>
            ))}
          </FilterRow>
          <FilterRow label="工具">
            {TOOL_FILTERS.map((f) => (
              <FilterPill
                key={f.key}
                active={toolFilter === f.key}
                onClick={() => setToolFilter(f.key)}
              >
                {f.label}
              </FilterPill>
            ))}
          </FilterRow>
        </div>

        {/* Transaction list */}
        <div className="mt-4 divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-14 text-slate-400">
              <CircleAlert className="h-5 w-5" />
              <p className="text-sm">当前筛选条件下暂无记录。</p>
            </div>
          ) : (
            filtered.map((t) => <TransactionRow key={t.id} tx={t} />)
          )}
        </div>
      </div>
    </div>
  );
}

interface MiniStatProps {
  label: string;
  value: string;
  meta: string;
}

function MiniStat({ label, value, meta }: MiniStatProps) {
  return (
    <div className="flex flex-col text-right">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="mt-0.5 text-lg font-semibold text-slate-950">
        {value}
      </span>
      <span className="text-[11px] text-slate-400">{meta}</span>
    </div>
  );
}

interface FilterRowProps {
  label: string;
  children: React.ReactNode;
}

function FilterRow({ label, children }: FilterRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 shrink-0 text-xs text-slate-400">{label}</span>
      <div className="flex flex-wrap items-center gap-1.5">{children}</div>
    </div>
  );
}

interface FilterPillProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function FilterPill({ active, onClick, children }: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-7 items-center rounded-full px-3 text-xs font-medium transition-colors",
        active
          ? "bg-slate-900 text-white shadow-sm"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900",
      )}
    >
      {children}
    </button>
  );
}

interface TxRowProps {
  tx: Transaction;
}

function TransactionRow({ tx }: TxRowProps) {
  const isVideo = tx.tool === "video-gen";
  const Icon = isVideo ? FileVideo : FileImage;
  const iconWrap = isVideo
    ? "bg-primary/5 text-primary"
    : "bg-purple-50 text-purple-500";

  const amountText =
    tx.amount === 0
      ? "0"
      : tx.amount > 0
        ? `+${tx.amount.toLocaleString()}`
        : tx.amount.toLocaleString();

  const amountCls =
    tx.amount > 0
      ? "text-emerald-600"
      : tx.amount < 0
        ? "text-rose-500"
        : tx.refund
          ? "text-rose-400"
          : "text-slate-400";

  return (
    <div className="flex items-center gap-3 py-3">
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
          iconWrap,
        )}
      >
        <Icon className="h-4 w-4" />
      </span>

      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "truncate text-sm font-semibold",
            tx.refund ? "text-rose-500" : "text-slate-900",
          )}
        >
          {tx.title}
        </div>
        <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
          <span className="tabular-nums">{tx.date}</span>
          <span
            className={cn(
              "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-medium",
              isVideo
                ? "bg-primary/10 text-primary"
                : "bg-purple-100 text-purple-600",
            )}
          >
            {tx.toolLabel}
          </span>
        </div>
      </div>

      <div
        className={cn(
          "shrink-0 text-right text-lg font-semibold tabular-nums",
          amountCls,
        )}
      >
        {amountText}
      </div>
      <div className="hidden w-24 shrink-0 text-right text-xs text-slate-400 tabular-nums sm:block">
        余额 {tx.balance.toLocaleString()}
      </div>
    </div>
  );
}
