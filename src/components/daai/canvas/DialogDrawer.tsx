"use client";

import { useState } from "react";
import { DIALOG_SKILLS } from "@/lib/canvas-data";
import {
  HistoryIcon,
  PlusIcon,
  SparkleIcon,
  SendIcon,
  SavePromptIcon,
  MyPromptsIcon,
  ArrowsExpandIcon,
  SkillGridIcon,
} from "./icons";

interface DialogDrawerProps {
  onClose: () => void;
}

export function DialogDrawer({ onClose }: DialogDrawerProps) {
  const [message, setMessage] = useState("");

  return (
    <aside className="pointer-events-auto flex h-full w-full flex-col border-l border-[rgba(74,96,119,0.12)] bg-white">
      <header className="flex items-center justify-between gap-2 px-4 py-3">
        <h2 className="text-[15px] font-semibold text-[var(--canvas-text)]">新对话</h2>
        <div className="flex items-center gap-1 text-[13px] text-[var(--canvas-text-muted)]">
          <button className="inline-flex items-center gap-1 rounded-lg px-2 py-1 transition hover:bg-[#f4f5f7] hover:text-[var(--canvas-text)]">
            <PlusIcon className="h-4 w-4" /> 新建
          </button>
          <button className="inline-flex items-center gap-1 rounded-lg px-2 py-1 transition hover:bg-[#f4f5f7] hover:text-[var(--canvas-text)]">
            <HistoryIcon className="h-4 w-4" /> 历史
          </button>
          <button
            aria-label="收起对话"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg transition hover:bg-[#f4f5f7] hover:text-[var(--canvas-text)]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-4 w-4" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6">
        <h3 className="text-[17px] font-semibold text-[var(--canvas-text)]">
          试试这些 <span className="underline decoration-[#c7ccd3] underline-offset-4">AI</span> 技能
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {DIALOG_SKILLS.map((s) => (
            <button
              key={s.key}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[rgba(74,96,119,0.14)] bg-white px-3.5 py-2.5 text-[13px] text-[var(--canvas-text)] shadow-sm transition hover:border-[rgba(74,96,119,0.3)] hover:shadow"
            >
              <SparkleIcon className="h-4 w-4 text-[#7c3aed]" />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3">
        <div className="rounded-2xl border border-[rgba(74,96,119,0.14)] bg-[#FCFDFE] p-2.5 shadow-[0_2px_20px_-4px_rgba(15,23,42,0.06)]">
          <div className="mb-1.5 flex items-center justify-between">
            <button className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--canvas-text-muted)] transition hover:bg-[#f1f2f4]">
              <ArrowsExpandIcon className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1">
              <button
                disabled
                className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--canvas-text-muted)] disabled:opacity-40"
              >
                <SavePromptIcon className="h-4 w-4" />
              </button>
              <button className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--canvas-text-muted)] transition hover:bg-[#f1f2f4]">
                <MyPromptsIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="输入消息，使用 @ 引用画布元素…"
            className="min-h-[52px] w-full resize-none bg-transparent text-[13px] leading-6 text-[var(--canvas-text)] outline-none placeholder:text-[var(--canvas-text-muted)]"
          />
          <div className="mt-1 flex items-center justify-between">
            <button className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[12px] text-[var(--canvas-text)] transition hover:bg-[#f1f2f4]">
              <SkillGridIcon className="h-3.5 w-3.5 text-[var(--canvas-text-muted)]" />
              选择技能
            </button>
            <div className="flex items-center gap-2 text-[12px] text-[var(--canvas-text-muted)]">
              <span>
                <span className="text-[#f5a623]">✦</span> 已消耗 0 积分
              </span>
              <button
                aria-label="发送"
                disabled={message.length === 0}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#27272a] text-white transition hover:bg-[#3f3f46] disabled:cursor-not-allowed disabled:bg-[#d4d4d8]"
              >
                <SendIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
