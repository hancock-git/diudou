"use client";

import { useState } from "react";
import {
  AudioLines,
  Blocks,
  BookOpen,
  Boxes,
  ChevronDown,
  Download,
  FileText,
  Film,
  FlaskConical,
  Layers,
  Music,
  Package,
  PlayCircle,
  Save,
  Scissors,
  Sparkles,
  Trash2,
  Type,
  Upload,
  Wand2,
} from "lucide-react";
import type { LucideIcon } from "@/types";
import { cn } from "@/lib/utils";

const STAT_PILLS: Array<{
  key: string;
  count: string;
  label: string;
  hint: string;
  icon: LucideIcon;
  iconBg: string;
  iconText: string;
}> = [
  {
    key: "materials",
    count: "0/5",
    label: "素材内容",
    hint: "视频或商品图",
    icon: Film,
    iconBg: "bg-sky-100",
    iconText: "text-sky-600",
  },
  {
    key: "scripts",
    count: "1/5",
    label: "脚本数量",
    hint: "单条最多 3 条",
    icon: FileText,
    iconBg: "bg-violet-100",
    iconText: "text-violet-600",
  },
  {
    key: "batch",
    count: "3/3",
    label: "本次裂变",
    hint: "脚本数 × 3，封顶 15",
    icon: Wand2,
    iconBg: "bg-amber-100",
    iconText: "text-amber-600",
  },
  {
    key: "quota",
    count: "20/20",
    label: "今日免费",
    hint: "超出扣积分",
    icon: Sparkles,
    iconBg: "bg-emerald-100",
    iconText: "text-emerald-600",
  },
];

const CHIPS = [
  "最多 5 条脚本",
  "单条脚本 3 条",
  "一次 15 条视频",
  "每日免费 20 条",
  "超出消耗积分",
];

const TIMELINE_STEPS: Array<{
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    step: 1,
    title: "上传参考视频",
    description: "放入爆款视频、商品视频或商品图，作为拆解和替换来源。",
    icon: Upload,
  },
  {
    step: 2,
    title: "AI拆解爆款结构",
    description: "拆出视频结构、脚本文案和视频分解片段，标注节奏与镜头逻辑。",
    icon: Scissors,
  },
  {
    step: 3,
    title: "替换元素并同步画布",
    description: "逐段替换文案、商品素材、视频片段和风险规避口径。",
    icon: Blocks,
  },
  {
    step: 4,
    title: "批量生成裂变视频",
    description: "每条脚本最多 3 条，5 条脚本一次最多 15 条。",
    icon: PlayCircle,
  },
];

const SCRIPT_SUB_TABS = [
  { key: "manual", label: "手动输入", enabled: true },
  { key: "ai", label: "AI帮写", enabled: true },
  { key: "library", label: "脚本库", enabled: false },
] as const;

type ScriptSubTab = (typeof SCRIPT_SUB_TABS)[number]["key"];

const CANVAS_SYNC_CARDS = [
  {
    key: "structure",
    title: "视频结构",
    description: "钩子、卖点证明、场景代入和成交收口会变成画布节点。",
    icon: Layers,
    tintBg: "bg-sky-50/70",
    tintBorder: "border-sky-100",
    tintIconBg: "bg-sky-100",
    tintIconText: "text-sky-600",
  },
  {
    key: "script",
    title: "脚本文案",
    description: "1-5 条脚本同步到文案节点，单条脚本最多裂变 3 条视频。",
    icon: FileText,
    tintBg: "bg-violet-50/70",
    tintBorder: "border-violet-100",
    tintIconBg: "bg-violet-100",
    tintIconText: "text-violet-600",
  },
  {
    key: "segments",
    title: "视频分解片段",
    description: "原视频片段、替换素材和 AI 视频提示词一起带入画布继续精修。",
    icon: Film,
    tintBg: "bg-emerald-50/70",
    tintBorder: "border-emerald-100",
    tintIconBg: "bg-emerald-100",
    tintIconText: "text-emerald-600",
  },
];

export default function RemixPage() {
  const [scriptTab] = useState<string>("script-1");
  const [scriptSubTab, setScriptSubTab] = useState<ScriptSubTab>("manual");
  const [scriptContent, setScriptContent] = useState<string>("");
  const [voice, setVoice] = useState<string>("auto");
  const [music, setMusic] = useState<string>("auto");
  const [textStyle, setTextStyle] = useState<string>("hype");
  const [maskOn, setMaskOn] = useState<boolean>(true);
  const [batchCount, setBatchCount] = useState<string>("3");

  return (
    <div className="space-y-4">
      {/* Hero */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Wand2 className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h1 className="text-lg font-semibold text-slate-950">
                爆款裂变
                <span className="mx-2 text-slate-300">/</span>
                <span className="text-slate-700">AI视频裂变</span>
              </h1>
              <p className="mt-1 max-w-3xl text-xs leading-5 text-slate-500">
                参考 DA AI 和即创：AI
                读取爆款视频，拆成视频结构、脚本文案、视频分解片段，再替换元素批量裂变。
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <PillButton icon={Package} label="资产库" />
            <PillButton icon={Save} label="保存到资产库" />
            <PillButton icon={Sparkles} label="进入画布" variant="primary" />
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STAT_PILLS.map((pill) => {
          const Icon = pill.icon;
          return (
            <div
              key={pill.key}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <span
                className={cn(
                  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                  pill.iconBg,
                  pill.iconText,
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <div className="text-lg font-semibold tabular-nums text-slate-950">
                  {pill.count}
                </div>
                <div className="mt-0.5 truncate text-[11px] text-slate-500">
                  {pill.label}
                  <span className="mx-1 text-slate-300">·</span>
                  {pill.hint}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Info card */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
              <FlaskConical className="h-4 w-4 text-primary" />
              爆款裂变主链路
            </div>
            <p className="mt-2 max-w-4xl text-xs leading-5 text-slate-500">
              上传爆款视频 -&gt; AI拆解视频结构 + 脚本文案 + 视频分解片段 -&gt;
              替换元素 -&gt; 按爆款逻辑批量合成/裂变。
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {CHIPS.map((chip) => (
              <span
                key={chip}
                className="inline-flex h-6 items-center rounded-full border border-slate-200 bg-slate-50 px-2 text-[11px] font-medium text-slate-600"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {TIMELINE_STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className="flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-xl font-bold tabular-nums text-primary">
                    {step.step}
                  </span>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-950">
                    <Icon className="h-4 w-4 text-slate-500" />
                    {step.title}
                  </div>
                </div>
                <p className="text-xs leading-5 text-slate-500">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 1. 添加素材内容 */}
      <SectionCard
        title="1. 添加素材内容"
        subtitle="放入爆款视频、商品视频或商品图，作为拆解和替换来源。"
        right={
          <span className="inline-flex h-6 items-center rounded-full border border-slate-200 bg-slate-50 px-2 text-[11px] font-medium text-slate-600 tabular-nums">
            0/5
          </span>
        }
      >
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 py-10 text-center">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Upload className="h-5 w-5" />
          </span>
          <div className="text-sm font-medium text-slate-700">
            点击或拖拽上传视频 / 商品图
          </div>
          <div className="text-[11px] text-slate-500">
            支持 MP4、MOV、JPG、PNG；单次最多 5 条素材，单文件 ≤ 200MB
          </div>
        </div>
      </SectionCard>

      {/* 2. 脚本文案 */}
      <SectionCard
        title="2. 脚本文案"
        subtitle="每条脚本会拆成最多 3 条裂变视频，最多同时保留 5 条脚本。"
        right={
          <PillButton icon={FileText} label="添加脚本" size="sm" />
        }
      >
        {/* Script tab bar */}
        <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2">
          <button
            type="button"
            className={cn(
              "inline-flex h-7 items-center rounded-full px-3 text-xs font-medium transition",
              scriptTab === "script-1"
                ? "bg-primary/10 text-primary"
                : "text-slate-500 hover:bg-slate-100",
            )}
          >
            脚本 1
          </button>
        </div>

        {/* Sub tabs */}
        <div className="mb-3 inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1">
          {SCRIPT_SUB_TABS.map((t) => {
            const isActive = scriptSubTab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                disabled={!t.enabled}
                onClick={() => t.enabled && setScriptSubTab(t.key)}
                className={cn(
                  "h-7 rounded-md px-3 text-xs font-medium transition",
                  isActive
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-500 hover:text-slate-900",
                  !t.enabled && "cursor-not-allowed opacity-50 hover:text-slate-500",
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="relative">
          <textarea
            value={scriptContent}
            onChange={(e) => setScriptContent(e.target.value.slice(0, 1000))}
            placeholder="输入脚本，可用「帮我写脚本」生成，或后续从脚本库获取。"
            className="h-32 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-800 outline-none placeholder:text-slate-400 focus:border-primary/30 focus:bg-white focus:ring-2 focus:ring-primary/10"
          />
          <div className="mt-1 flex justify-end text-[11px] tabular-nums text-slate-400">
            {scriptContent.length}/1000
          </div>
        </div>
      </SectionCard>

      {/* 3. AI拆解 */}
      <SectionCard
        title="3. AI拆解：视频结构 + 脚本文案 + 视频分解片段"
        subtitle="上传爆款素材并补齐脚本后，一键生成结构化片段。"
        right={
          <div className="flex flex-wrap items-center gap-2">
            <PillButton icon={Scissors} label="自动拆分" size="sm" disabled />
            <PillButton icon={Sparkles} label="进入画布" size="sm" disabled />
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 py-10 text-center">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <Scissors className="h-5 w-5" />
          </span>
          <div className="max-w-xl text-xs leading-5 text-slate-500">
            添加爆款视频或商品素材，再补 1-5
            条脚本，系统会拆成视频结构、脚本文案和视频分解片段。
          </div>
          <div className="text-[11px] text-slate-400">
            上传视频后，点击自动拆分生成可参与重组的片段。
          </div>
        </div>
      </SectionCard>

      {/* 4. 替换素材 */}
      <SectionCard
        title="4. 替换素材 / 文案后裂变"
        subtitle="按拆解结果替换商品素材、文案与镜头，产出批量裂变视频。"
        right={
          <div className="flex flex-wrap items-center gap-2">
            <SelectPill
              value={batchCount}
              onChange={setBatchCount}
              options={[
                { value: "1", label: "裂变 1 条" },
                { value: "3", label: "裂变 3 条" },
              ]}
            />
            <PillButton icon={Wand2} label="开始裂变" size="sm" disabled variant="primary" />
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 py-10 text-center">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <Blocks className="h-5 w-5" />
          </span>
          <div className="max-w-xl text-xs leading-5 text-slate-500">
            拆分后会在这里逐段编辑文案和替换素材。
          </div>
        </div>
      </SectionCard>

      {/* 更多配置 */}
      <SectionCard
        title="更多配置"
        subtitle="对齐 DA AI / 即创的批量成片体验：配音、音乐、花字、字幕蒙版先保留入口。"
      >
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700">商免素材</span>
          <span className="inline-flex h-5 items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 text-[10px] font-medium text-emerald-600">
            默认商用免费
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <ConfigSelect
            icon={AudioLines}
            label="配音"
            value={voice}
            onChange={setVoice}
            options={[
              { value: "auto", label: "系统智能匹配" },
              { value: "male", label: "真人播客男" },
              { value: "female", label: "流畅女声" },
              { value: "clone", label: "克隆音色（收费）" },
            ]}
          />
          <ConfigSelect
            icon={Music}
            label="音乐"
            value={music}
            onChange={setMusic}
            options={[
              { value: "auto", label: "商免音乐智能推荐" },
              { value: "cheer", label: "轻快种草" },
              { value: "review", label: "测评节奏" },
              { value: "none", label: "暂不添加" },
            ]}
          />
          <ConfigSelect
            icon={Type}
            label="花字"
            value={textStyle}
            onChange={setTextStyle}
            options={[
              { value: "hype", label: "爆款花字高亮" },
              { value: "default", label: "默认字幕" },
              { value: "outline", label: "卖点描边字" },
              { value: "none", label: "暂不添加" },
            ]}
          />
        </div>

        <button
          type="button"
          onClick={() => setMaskOn((v) => !v)}
          className={cn(
            "mt-4 flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition",
            maskOn
              ? "border-primary/30 bg-primary/5"
              : "border-slate-200 bg-white hover:bg-slate-50",
          )}
        >
          <div className="flex items-center gap-3">
            <span
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-lg",
                maskOn
                  ? "bg-primary/15 text-primary"
                  : "bg-slate-100 text-slate-500",
              )}
            >
              <BookOpen className="h-4 w-4" />
            </span>
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-950">
                字幕/水印蒙版
                {maskOn ? (
                  <span className="inline-flex h-5 items-center rounded-full bg-primary/15 px-2 text-[10px] font-medium text-primary">
                    已开启
                  </span>
                ) : null}
              </div>
              <div className="mt-0.5 text-[11px] text-slate-500">
                自动识别原视频字幕和水印区域，做遮罩防止版权问题。
              </div>
            </div>
          </div>
          <span
            className={cn(
              "relative inline-flex h-5 w-9 shrink-0 rounded-full transition",
              maskOn ? "bg-primary" : "bg-slate-300",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
                maskOn ? "translate-x-4" : "translate-x-0.5",
              )}
            />
          </span>
        </button>
      </SectionCard>

      {/* 裂变视频 */}
      <SectionCard
        title="裂变视频"
        subtitle="提交任务后，这里展示本次 3 条 AI 裂变视频，单次最多 15 条。"
        right={
          <div className="flex flex-wrap items-center gap-2">
            <PillButton icon={Download} label="下载" size="sm" disabled />
            <PillButton icon={Trash2} label="删除" size="sm" disabled />
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 py-10 text-center">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <Film className="h-5 w-5" />
          </span>
          <div className="text-xs text-slate-500">暂无裂变视频</div>
        </div>
      </SectionCard>

      {/* 画布同步 */}
      <SectionCard
        title="画布同步与关联"
        subtitle="爆款裂变就是面板式画布，拆解后的结构、文案和片段可继续送入画布做精细调整。"
        right={<PillButton icon={Sparkles} label="进入画布" size="sm" variant="primary" />}
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {CANVAS_SYNC_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.key}
                className={cn(
                  "flex flex-col gap-3 rounded-2xl border p-4",
                  card.tintBg,
                  card.tintBorder,
                )}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex h-8 w-8 items-center justify-center rounded-lg",
                      card.tintIconBg,
                      card.tintIconText,
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="text-sm font-semibold text-slate-950">
                    {card.title}
                  </div>
                </div>
                <p className="text-xs leading-5 text-slate-600">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* 任务与计费规则 */}
      <SectionCard
        title="任务与计费规则"
        subtitle="1-5 条脚本，单条最多裂变 3 条视频，每次任务上限 15 条。"
      >
        <div className="space-y-3 text-xs leading-6 text-slate-600">
          <p>
            每条脚本最多产出 3 条视频；本次批次最多 5
            条脚本，一次生成上限 15 条视频。任务提交后可在「裂变视频」区块查看结果。
          </p>
          <p>
            每日 20
            条免费额度覆盖大部分测试与实际拉片场景，超出会计入积分消耗，未成功任务不扣费。
          </p>
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-slate-500">
            <Boxes className="h-4 w-4 text-primary" />
            <span>
              可用积分：<span className="font-semibold text-slate-800">无限</span>。
              AI生视频、克隆音色等真实 token 消耗项接入后再扣费。
            </span>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

/* ---------- Local sub-components ---------- */

interface SectionCardProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children?: React.ReactNode;
}

function SectionCard({ title, subtitle, right, children }: SectionCardProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-slate-950">{title}</h2>
          {subtitle ? (
            <p className="mt-1 text-xs leading-5 text-slate-500">{subtitle}</p>
          ) : null}
        </div>
        {right ? (
          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            {right}
          </div>
        ) : null}
      </div>
      {children}
    </section>
  );
}

interface PillButtonProps {
  icon: LucideIcon;
  label: string;
  variant?: "default" | "primary";
  size?: "md" | "sm";
  disabled?: boolean;
  onClick?: () => void;
}

function PillButton({
  icon: Icon,
  label,
  variant = "default",
  size = "md",
  disabled,
  onClick,
}: PillButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:pointer-events-none disabled:opacity-50",
        size === "md" ? "h-8 px-3 text-xs" : "h-7 px-2.5 text-xs",
        variant === "primary"
          ? "bg-primary text-white shadow-sm hover:bg-primary/90"
          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900",
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

interface SelectPillProps {
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}

function SelectPill({ value, onChange, options }: SelectPillProps) {
  return (
    <label className="relative inline-flex h-7 items-center rounded-full border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-full cursor-pointer appearance-none rounded-full bg-transparent pl-3 pr-7 outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
    </label>
  );
}

interface ConfigSelectProps {
  icon: LucideIcon;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}

function ConfigSelect({
  icon: Icon,
  label,
  value,
  onChange,
  options,
}: ConfigSelectProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
        <Icon className="h-3.5 w-3.5 text-slate-500" />
        {label}
      </div>
      <label className="relative block">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-full cursor-pointer appearance-none rounded-lg border border-slate-200 bg-slate-50 pl-3 pr-8 text-xs text-slate-800 outline-none focus:border-primary/30 focus:bg-white focus:ring-2 focus:ring-primary/10"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </label>
    </div>
  );
}
