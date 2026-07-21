"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CloseIcon } from "./icons";

interface TemplatesPanelProps {
  onClose: () => void;
}

const TABS = [
  { key: "mine", label: "我的模版" },
  { key: "system", label: "系统模版" },
] as const;

export function TemplatesPanel({ onClose }: TemplatesPanelProps) {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("mine");

  return (
    <div className="pointer-events-auto absolute left-[76px] top-1/2 z-[1250] w-[320px] -translate-y-1/2 overflow-hidden rounded-2xl border border-[rgba(74,96,119,0.1)] bg-white/98 shadow-[0_22px_60px_rgba(15,23,42,0.16)] backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-3">
        <h3 className="text-[14px] font-semibold text-[var(--canvas-text)]">模板库</h3>
        <button
          aria-label="关闭"
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded-lg text-[var(--canvas-text-muted)] transition hover:bg-[#f4f5f7]"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>
      <div className="mx-4 mb-3 flex rounded-lg bg-[#f1f1f3] p-0.5">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex-1 rounded-md py-1.5 text-[12px] font-medium transition",
              tab === t.key
                ? "bg-white text-[var(--canvas-text)] shadow-sm"
                : "text-[var(--canvas-text-muted)]",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex h-[220px] items-center justify-center text-[13px] text-[var(--canvas-text-muted)]">
        暂无模版
      </div>
    </div>
  );
}
