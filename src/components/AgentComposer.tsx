"use client";

import { useState } from "react";
import { Paperclip, AtSign, ArrowUp } from "lucide-react";
import { ModeSelector } from "@/components/ModeSelector";
import type { CreationMode } from "@/types";
import { cn } from "@/lib/utils";

const PLACEHOLDER: Record<CreationMode, string> = {
  copy: "粘贴商品链接 / 视频 / 图集，AI 帮你提取口播文案……",
  rewrite: "粘贴已有文案，AI 帮你改写、裂变出多个爆款版本……",
  storyboard: "粘贴定稿脚本，AI 帮你拆分镜并生成视频片段……",
};

export function AgentComposer() {
  const [mode, setMode] = useState<CreationMode>("copy");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition focus-within:border-primary/30 focus-within:ring-4 focus-within:ring-primary/10">
      <textarea
        key={mode}
        placeholder={PLACEHOLDER[mode]}
        className="block min-h-[104px] w-full resize-none bg-transparent px-2 pt-1 text-sm leading-6 text-slate-800 outline-none placeholder:text-slate-400"
      />

      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <ModeSelector value={mode} onChange={setMode} />
          <ToolButton icon={Paperclip} label="参考图" />
          <ToolButton icon={AtSign} label="选择主体" />
        </div>

        <button
          type="button"
          aria-label="发送"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-sm transition hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

interface ToolButtonProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
}

function ToolButton({ icon: Icon, label }: ToolButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900",
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
