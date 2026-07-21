"use client";

import { cn } from "@/lib/utils";
import { MiniMapIcon, GridIcon, MinusIcon, PlusIcon } from "./icons";

interface BottomControlsProps {
  zoom: number;
  minimapOn: boolean;
  onToggleMinimap: () => void;
  onAutoArrange: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export function BottomControls({
  zoom,
  minimapOn,
  onToggleMinimap,
  onAutoArrange,
  onZoomIn,
  onZoomOut,
  onReset,
}: BottomControlsProps) {
  return (
    <div className="pointer-events-auto absolute bottom-4 left-4 z-[1200] flex items-center gap-1 rounded-xl border border-[rgba(74,96,119,0.1)] bg-white/95 px-1.5 py-1.5 text-[var(--canvas-text-muted)] shadow-[0_8px_26px_rgba(31,45,61,0.1)] backdrop-blur-md">
      <button
        type="button"
        aria-label="小地图"
        title="小地图"
        onClick={onToggleMinimap}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-lg transition hover:bg-[#f4f5f7] hover:text-[var(--canvas-text)]",
          minimapOn && "bg-[#f1f1f3] text-[var(--canvas-text)]",
        )}
      >
        <MiniMapIcon className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label="自动整理卡片"
        title="自动整理卡片"
        onClick={onAutoArrange}
        className="flex h-7 w-7 items-center justify-center rounded-lg transition hover:bg-[#f4f5f7] hover:text-[var(--canvas-text)]"
      >
        <GridIcon className="h-4 w-4" />
      </button>
      <span className="mx-0.5 h-4 w-px bg-[rgba(74,96,119,0.16)]" aria-hidden />
      <button
        type="button"
        aria-label="缩小"
        onClick={onZoomOut}
        className="flex h-7 w-7 items-center justify-center rounded-lg transition hover:bg-[#f4f5f7] hover:text-[var(--canvas-text)]"
      >
        <MinusIcon className="h-4 w-4" />
      </button>
      <span className="min-w-[42px] text-center text-[13px] font-medium text-[var(--canvas-text)] tabular-nums">
        {Math.round(zoom * 100)}%
      </span>
      <button
        type="button"
        aria-label="放大"
        onClick={onZoomIn}
        className="flex h-7 w-7 items-center justify-center rounded-lg transition hover:bg-[#f4f5f7] hover:text-[var(--canvas-text)]"
      >
        <PlusIcon className="h-4 w-4" />
      </button>
      <button
        type="button"
        aria-label="重置"
        onClick={onReset}
        className="ml-0.5 flex h-7 items-center justify-center rounded-lg px-2 text-[13px] transition hover:bg-[#f4f5f7] hover:text-[var(--canvas-text)]"
      >
        重置
      </button>
    </div>
  );
}
