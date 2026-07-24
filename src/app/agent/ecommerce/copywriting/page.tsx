"use client";

import { useState } from "react";
import { FileText, Wand2, Video, Upload, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

// ---- Data ----

type StepKey = "generate" | "rewrite" | "storyboard";

const STEPS: {
  key: StepKey;
  index: string;
  title: string;
  description: string;
  icon: typeof FileText;
}[] = [
  {
    key: "generate",
    index: "01",
    title: "脚本生成",
    description: "按品类、场景和卖点生成当前版本脚本。",
    icon: FileText,
  },
  {
    key: "rewrite",
    index: "02",
    title: "脚本改写/裂变",
    description: "承接参考文案，做 1:1 改写和批量裂变。",
    icon: Wand2,
  },
  {
    key: "storyboard",
    index: "03",
    title: "分镜与片段生成",
    description: "把定稿脚本拆成分镜，再生成视频片段。",
    icon: Video,
  },
];

const CATEGORIES = ["电商", "大健康", "工具软件", "金融", "教育", "汽车"] as const;

const SCENES = [
  { key: "shortvideo", label: "短视频带货", desc: "适合信息流种草、测评、场景痛点和转化收口。" },
  { key: "livestream", label: "引流直播间", desc: "强调直播间利益点、进房理由和活动承接。" },
  { key: "platform", label: "平台电商", desc: "适合店铺承接、搜索转化、商品卡和详情页口径。" },
] as const;

const STYLES = ["不限", "国货", "达人种草", "老板人设", "家庭视角", "网感营销"] as const;

const LENGTHS = [
  { value: "auto", label: "自动匹配" },
  { value: "50-75", label: "50-75字" },
  { value: "75-150", label: "75-150字" },
  { value: "150-300", label: "150-300字" },
  { value: "300+", label: "300字以上" },
] as const;

// ---- Primitives ----

const CARD = "rounded-xl border border-slate-200 bg-white p-3 shadow-sm";
const LABEL = "text-xs font-semibold text-slate-700";
const FIELD =
  "w-full rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:border-primary/30 focus:bg-white focus:ring-2 focus:ring-primary/10";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className={LABEL}>{children}</div>;
}

function Pill({
  active,
  activeTone = "dark",
  title,
  onClick,
  children,
}: {
  active: boolean;
  activeTone?: "dark" | "primary";
  title?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "h-8 rounded-full px-3 text-xs font-semibold transition",
        active
          ? activeTone === "primary"
            ? "bg-primary text-white shadow-sm"
            : "bg-slate-950 text-white shadow-sm"
          : "bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:text-slate-950",
      )}
    >
      {children}
    </button>
  );
}

function UploadButton() {
  return (
    <button
      type="button"
      className="inline-flex h-7 shrink-0 items-center gap-1 rounded-full border border-slate-200 bg-white px-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
    >
      <Upload className="h-3.5 w-3.5" />
      上传识别
    </button>
  );
}

function LabelRow({
  label,
  upload = false,
}: {
  label: string;
  upload?: boolean;
}) {
  return (
    <div className="flex min-h-7 flex-wrap items-center justify-between gap-2">
      <SectionLabel>{label}</SectionLabel>
      {upload ? <UploadButton /> : null}
    </div>
  );
}

function Field({
  label,
  placeholder,
  upload = false,
  minH,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  upload?: boolean;
  minH: number;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className={CARD}>
      {upload ? (
        <LabelRow label={label} upload />
      ) : (
        <SectionLabel>{label}</SectionLabel>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ minHeight: minH }}
        className={cn(FIELD, "mt-2 resize-y px-3 py-2 leading-6")}
      />
    </div>
  );
}

// ---- Page ----

export default function CopywritingPage() {
  const [activeStep, setActiveStep] = useState<StepKey>("generate");
  const [category, setCategory] = useState<string>("电商");
  const [scene, setScene] = useState<string>("shortvideo");
  const [style, setStyle] = useState<string>("不限");
  const [length, setLength] = useState<string>("auto");

  const [product, setProduct] = useState("");
  const [selling, setSelling] = useState("");
  const [promo, setPromo] = useState("");
  const [useScene, setUseScene] = useState("");
  const [audience, setAudience] = useState("");
  const [painpoints, setPainpoints] = useState("");
  const [reference, setReference] = useState("");
  const [feedback, setFeedback] = useState("");

  return (
    <>
      {/* Header card: title + step tabs */}
      <section className="rounded-2xl border border-black/10 bg-white shadow-sm">
        <div className="grid gap-3 border-b border-black/5 px-4 py-3 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center">
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-slate-950">
              超级编导
            </h1>
            <span className="inline-flex h-5 items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
              AI视频脚本
            </span>
          </div>

          <div className="grid min-w-0 gap-2 md:grid-cols-3">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = step.key === activeStep;
              return (
                <button
                  key={step.key}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveStep(step.key)}
                  className={cn(
                    "min-h-[64px] rounded-xl border px-3 py-2 text-left transition",
                    isActive
                      ? "border-primary/40 bg-primary/[0.07] text-primary shadow-sm ring-2 ring-primary/10"
                      : "border-slate-200 bg-white hover:bg-slate-50",
                  )}
                >
                  <div className="flex h-full items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                          isActive
                            ? "bg-primary text-white"
                            : "bg-slate-100 text-slate-500",
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <div
                          className={cn(
                            "text-sm font-semibold",
                            isActive ? "text-primary" : "text-slate-900",
                          )}
                        >
                          {step.title}
                        </div>
                        <div className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                          {step.description}
                        </div>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums",
                        isActive
                          ? "bg-primary text-white"
                          : "bg-slate-100 text-slate-500",
                      )}
                    >
                      {step.index}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Body: form (380px) + result (1fr) */}
      <div className="grid gap-3 lg:grid-cols-[380px_minmax(0,1fr)]">
        {/* Form column */}
        <div className="space-y-3">
          {/* 品类 + 营销场景 */}
          <div className={CARD}>
            <div className="space-y-3">
              <div>
                <SectionLabel>品类</SectionLabel>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {CATEGORIES.map((c) => (
                    <Pill
                      key={c}
                      active={category === c}
                      onClick={() => setCategory(c)}
                    >
                      {c}
                    </Pill>
                  ))}
                </div>
              </div>
              <div>
                <SectionLabel>营销场景</SectionLabel>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {SCENES.map((s) => (
                    <Pill
                      key={s.key}
                      active={scene === s.key}
                      activeTone="primary"
                      title={s.desc}
                      onClick={() => setScene(s.key)}
                    >
                      {s.label}
                    </Pill>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 商品信息 */}
          <div className={CARD}>
            <SectionLabel>商品信息</SectionLabel>
            <input
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="请输入商品ID或名称"
              className={cn(FIELD, "mt-2 min-h-[44px] px-3")}
            />
          </div>

          {/* 商品卖点 */}
          <Field
            label="商品卖点"
            upload
            minH={84}
            placeholder={`请输入产品卖点，如“饱和度高；不易脱妆”，多个卖点使用回车或分号分隔`}
            value={selling}
            onChange={setSelling}
          />

          {/* 优惠活动 */}
          <Field
            label="优惠活动（选填）"
            upload
            minH={84}
            placeholder={`请输入价格/优惠活动，如“拍一发三”“99元三件”等`}
            value={promo}
            onChange={setPromo}
          />

          {/* 适用场景 */}
          <Field
            label="适用场景（选填）"
            minH={72}
            placeholder={`请输入商品的适用场景，例如“约会”“通勤”“送礼”`}
            value={useScene}
            onChange={setUseScene}
          />

          {/* 适用人群 */}
          <Field
            label="适用人群（选填）"
            minH={72}
            placeholder={`请输入产品的适用人群，如“宝妈；小姐姐；上班族”`}
            value={audience}
            onChange={setAudience}
          />

          {/* 用户痛点 */}
          <Field
            label="用户痛点（选填）"
            minH={72}
            placeholder={`请输入商品解决的痛点，例如“没气色；价格昂贵；清洁麻烦”`}
            value={painpoints}
            onChange={setPainpoints}
          />

          {/* 参考素材 */}
          <Field
            label="参考素材 / 甲方资料（选填）"
            upload
            minH={96}
            placeholder="粘贴甲方需求、参考口播、对标素材拆解或活动规则；也可以先上传识别后再整理。"
            value={reference}
            onChange={setReference}
          />

          {/* 审核反馈 */}
          <Field
            label="审核反馈 / 额外要求（选填）"
            upload
            minH={136}
            placeholder="粘贴违禁词、平台审核反馈、品牌禁用话术；生成结果会在文案中直接标出风险词。 也可补充适用场景、口播语气、甲方要求或不能出现的表达。"
            value={feedback}
            onChange={setFeedback}
          />

          {/* 脚本风格 + 脚本字数 */}
          <div className={CARD}>
            <div className="space-y-3">
              <div>
                <SectionLabel>脚本风格</SectionLabel>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {STYLES.map((s) => (
                    <Pill
                      key={s}
                      active={style === s}
                      onClick={() => setStyle(s)}
                    >
                      {s}
                    </Pill>
                  ))}
                </div>
              </div>
              <div>
                <SectionLabel>脚本字数</SectionLabel>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className={cn(FIELD, "mt-2 h-9 px-3")}
                >
                  {LENGTHS.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 立即生成 */}
          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              className="inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-primary text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90 sm:flex-1"
            >
              <Sparkles className="h-4 w-4" />
              立即生成
            </button>
          </div>
        </div>

        {/* Result panel */}
        <aside>
          <div className="rounded-xl border border-primary/20 bg-white p-4 shadow-sm ring-1 ring-primary/5 xl:min-h-[680px]">
            <div className="text-sm font-semibold text-slate-950">文案结果</div>
            <div className="mt-3 space-y-3">
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-24 text-center text-sm text-slate-500">
                暂无结果
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
