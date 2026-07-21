"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  NODE_KIND_META,
  IMAGE_MODELS,
  IMAGE_ASPECTS,
  IMAGE_QUALITIES,
  type CanvasNodeKind,
} from "@/lib/canvas-data";
import {
  ArrowsExpandIcon,
  SavePromptIcon,
  MyPromptsIcon,
  SendIcon,
  ChevronDownIcon,
  UploadIcon,
  AssetLibraryIcon,
  SkillGridIcon,
} from "./icons";

export interface InspectorAnchor {
  left: number;
  top: number;
  width: number;
  bottom: number;
}

interface SelectionInspectorProps {
  kind: CanvasNodeKind;
  text: string;
  anchor: InspectorAnchor;
  onTextChange: (v: string) => void;
}

function Selector({ options, value, onChange }: { options: readonly string[]; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as HTMLElement)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[12px] text-[var(--canvas-text)] transition hover:bg-[#f1f2f4]"
      >
        {value}
        <ChevronDownIcon className="h-3 w-3 text-[var(--canvas-text-muted)]" />
      </button>
      {open && (
        <div className="absolute bottom-[calc(100%+4px)] left-0 z-30 min-w-[96px] overflow-hidden rounded-lg border border-[rgba(74,96,119,0.14)] bg-white py-1 text-[12px] shadow-[0_18px_40px_rgba(31,45,61,0.14)]">
          {options.map((o) => (
            <button
              key={o}
              onClick={() => {
                onChange(o);
                setOpen(false);
              }}
              className={cn(
                "block w-full px-3 py-1.5 text-left hover:bg-[#f4f5f7]",
                o === value && "text-[var(--canvas-text)]",
              )}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function SelectionInspector({ kind, text, anchor, onTextChange }: SelectionInspectorProps) {
  const meta = NODE_KIND_META[kind];
  const [model, setModel] = useState<string>(IMAGE_MODELS[0]);
  const [aspect, setAspect] = useState<string>(IMAGE_ASPECTS[0]);
  const [quality, setQuality] = useState<string>(IMAGE_QUALITIES[0]);
  const charCount = text.length;
  const width = Math.min(660, Math.max(anchor.width, 420));

  return (
    <>
      {/* floating top toolbar */}
      <div
        className="pointer-events-auto absolute z-[1350] flex -translate-x-1/2 items-center gap-1 rounded-xl border border-[rgba(74,96,119,0.12)] bg-[rgba(244,245,247,0.82)] px-1 py-1 text-[12px] text-[var(--canvas-text)] shadow-[0_8px_26px_rgba(31,45,61,0.08)] backdrop-blur-md"
        style={{ left: anchor.left + anchor.width / 2, top: anchor.top - 44 }}
      >
        {kind === "markdown" ? (
          <>
            <span className="px-2 text-[var(--canvas-text-muted)]">{charCount} 字</span>
            <button
              disabled={charCount === 0}
              className="rounded-lg px-2 py-1 transition hover:bg-white/60 disabled:opacity-40"
            >
              帮我写
            </button>
            <button className="inline-flex items-center gap-1 rounded-lg px-2 py-1 transition hover:bg-white/60">
              <ArrowsExpandIcon className="h-3.5 w-3.5" />
              展开
            </button>
          </>
        ) : (
          <>
            <button className="inline-flex items-center gap-1 rounded-lg px-2 py-1 transition hover:bg-white/60">
              <UploadIcon className="h-3.5 w-3.5" />
              上传
            </button>
            <button className="inline-flex items-center gap-1 rounded-lg px-2 py-1 transition hover:bg-white/60">
              <AssetLibraryIcon className="h-3.5 w-3.5" />
              从资产库选择
            </button>
          </>
        )}
      </div>

      {/* bottom composer / inspector dialog */}
      <div
        className="pointer-events-auto absolute z-[1350] flex -translate-x-1/2 justify-center"
        style={{ left: anchor.left + anchor.width / 2, top: anchor.bottom + 16 }}
      >
        <div
          className="relative flex flex-col gap-2 overflow-visible rounded-xl border border-[#E4E8ED] bg-[#FDFEFE] p-3 shadow-[0_2px_20px_-4px_rgba(15,23,42,0.06),0_0_0_1px_rgba(15,23,42,0.02)] ring-1 ring-black/[0.015]"
          style={{ width }}
        >
          {/* right-side action rail */}
          <div className="absolute right-2 top-2 z-10 flex flex-col items-center gap-1">
            <button
              title="展开指令区"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--canvas-text-muted)] transition hover:bg-[#f1f2f4] hover:text-[var(--canvas-text)]"
            >
              <ArrowsExpandIcon className="h-4 w-4" />
            </button>
            <button
              disabled
              title="保存当前提示词"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--canvas-text-muted)] transition hover:bg-[#f1f2f4] disabled:opacity-40"
            >
              <SavePromptIcon className="h-4 w-4" />
            </button>
            <button
              title="我的提示词"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--canvas-text-muted)] transition hover:bg-[#f1f2f4] hover:text-[var(--canvas-text)]"
            >
              <MyPromptsIcon className="h-4 w-4" />
            </button>
          </div>

          <textarea
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder={meta.inspectorPlaceholder}
            className="min-h-[92px] w-full resize-none bg-transparent pr-8 text-[13px] leading-6 text-[var(--canvas-text)] outline-none placeholder:text-[var(--canvas-text-muted)]"
          />

          <div className="flex items-center justify-between gap-2 border-t border-[#EEF1F4] pt-2">
            <div className="flex min-w-0 items-center gap-0.5">
              {kind === "image" ? (
                <>
                  <Selector options={IMAGE_MODELS} value={model} onChange={setModel} />
                  <Selector options={IMAGE_ASPECTS} value={aspect} onChange={setAspect} />
                  <Selector options={IMAGE_QUALITIES} value={quality} onChange={setQuality} />
                  <button className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[12px] text-[var(--canvas-text)] transition hover:bg-[#f1f2f4]">
                    <SkillGridIcon className="h-3.5 w-3.5 text-[var(--canvas-text-muted)]" />
                    技能包
                    <ChevronDownIcon className="h-3 w-3 text-[var(--canvas-text-muted)]" />
                  </button>
                </>
              ) : (
                <span />
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="whitespace-nowrap text-[12px] text-[var(--canvas-text-muted)]">
                <span className="text-[#f5a623]">✦</span>
                {meta.price}
                <span className="text-[var(--canvas-text-muted)]"> / {meta.priceUnit}</span>
              </span>
              <button
                aria-label="发送"
                disabled={charCount === 0}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#27272a] text-white transition hover:bg-[#3f3f46] disabled:cursor-not-allowed disabled:bg-[#d4d4d8]"
              >
                <SendIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
