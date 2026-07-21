"use client";

import { cn } from "@/lib/utils";
import { type CanvasNodeKind } from "@/lib/canvas-data";
import { PlusIcon, TemplateIcon, HistoryIcon, HelpIcon } from "./icons";
import { AddNodeMenu } from "./AddNodeMenu";

export type CanvasTool = "add" | "cursor" | "hand" | "template";

interface LeftToolbarProps {
  tool: CanvasTool;
  addMenuOpen: boolean;
  templatesOpen: boolean;
  onSelectTool: (t: CanvasTool) => void;
  onToggleAddMenu: () => void;
  onToggleTemplates: () => void;
  onAddNode: (kind: CanvasNodeKind) => void;
}

const ACTIVE_CLS =
  "bg-white text-zinc-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_3px_10px_rgba(26,44,66,0.14)]";
const IDLE_CLS =
  "text-[var(--canvas-text-muted)] hover:bg-white/[0.58] hover:text-[var(--canvas-text)]";

/** Icon rendered from a remote-style svg via CSS mask so it follows text color. */
function MaskIcon({ src }: { src: string }) {
  return (
    <span
      aria-hidden
      className="h-[18px] w-[18px] bg-current"
      style={{
        WebkitMask: `url(${src}) center / contain no-repeat`,
        mask: `url(${src}) center / contain no-repeat`,
      }}
    />
  );
}

/** Compact 36px icon-only tool (add / cursor / hand). */
function RailAction({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "rail-action inline-flex h-9 w-9 items-center justify-center rounded-2xl transition",
        active ? ACTIVE_CLS : IDLE_CLS,
      )}
    >
      {children}
    </button>
  );
}

/** 44px labeled slot (templates / history / help). */
function RailSlot({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-11 w-11 flex-col items-center justify-center gap-1 rounded-2xl px-0.5 py-1 transition",
        disabled ? "cursor-not-allowed text-[var(--canvas-text-muted)] opacity-40" : active ? ACTIVE_CLS : IDLE_CLS,
      )}
    >
      <span className="inline-flex h-[18px] w-[18px] items-center justify-center [&>svg]:h-[15px] [&>svg]:w-[15px]">
        {children}
      </span>
      <span className="w-full whitespace-nowrap text-center text-[10px] font-medium leading-none">
        {label}
      </span>
    </button>
  );
}

export function LeftToolbar({
  tool,
  addMenuOpen,
  templatesOpen,
  onSelectTool,
  onToggleAddMenu,
  onToggleTemplates,
  onAddNode,
}: LeftToolbarProps) {
  return (
    <div className="pointer-events-auto absolute left-3 top-1/2 z-[1200] flex -translate-y-1/2 items-start gap-2">
      <div className="canvas-rail-strip flex w-14 flex-col items-center gap-0.5 rounded-xl border-[0.8px] border-[rgba(79,103,127,0.16)] bg-white/[0.58] px-1 py-1.5 shadow-[0_6px_20px_rgba(39,56,78,0.14)] backdrop-blur-md">
        <RailAction label="添加节点" active={addMenuOpen} onClick={onToggleAddMenu}>
          <PlusIcon className="h-5 w-5" />
        </RailAction>

        <div className="my-0.5 h-px w-5 bg-[rgba(44,62,82,0.12)]" aria-hidden />

        <RailAction label="鼠标工具" active={tool === "cursor"} onClick={() => onSelectTool("cursor")}>
          <MaskIcon src="/images/canvas/icons/mouse.svg" />
        </RailAction>
        <RailAction label="抓手工具" active={tool === "hand"} onClick={() => onSelectTool("hand")}>
          <MaskIcon src="/images/canvas/icons/hand.svg" />
        </RailAction>

        <RailSlot label="模版" active={templatesOpen} onClick={onToggleTemplates}>
          <TemplateIcon />
        </RailSlot>
        <RailSlot label="历史" disabled>
          <HistoryIcon />
        </RailSlot>

        <div className="my-0.5 h-px w-5 bg-[rgba(44,62,82,0.12)]" aria-hidden />

        <RailSlot label="帮助" disabled>
          <HelpIcon />
        </RailSlot>
      </div>

      {addMenuOpen && <AddNodeMenu onSelect={onAddNode} />}
    </div>
  );
}
