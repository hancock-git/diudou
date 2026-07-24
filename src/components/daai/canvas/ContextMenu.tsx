"use client";

import { useEffect, useRef, type ComponentType } from "react";
import {
  Download,
  Copy,
  CopyPlus,
  ClipboardPaste,
  Trash2,
  Upload,
  FolderOpen,
  Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type CanvasMenuKind = "node" | "pane";
export type CanvasMenuAction =
  | "save"
  | "copy"
  | "duplicate"
  | "paste"
  | "delete"
  | "upload"
  | "asset"
  | "undo";

interface MenuItem {
  action?: CanvasMenuAction;
  label?: string;
  icon?: ComponentType<{ className?: string }>;
  hint?: string;
  disabled?: boolean;
  danger?: boolean;
  separator?: boolean;
}

const NODE_ITEMS: MenuItem[] = [
  { action: "save", label: "保存到本地", icon: Download },
  { action: "copy", label: "复制节点", icon: Copy, hint: "Ctrl+C" },
  { action: "duplicate", label: "创建副本", icon: CopyPlus },
  { action: "paste", label: "粘贴", icon: ClipboardPaste, hint: "Ctrl+V" },
  { action: "delete", label: "删除", icon: Trash2, danger: true },
];

const PANE_ITEMS: MenuItem[] = [
  { action: "upload", label: "从本地上传", icon: Upload },
  { action: "asset", label: "从素材库选择", icon: FolderOpen },
  { separator: true },
  { action: "undo", label: "撤销", icon: Undo2, disabled: true },
  { action: "paste", label: "粘贴", icon: ClipboardPaste },
];

interface ContextMenuProps {
  kind: CanvasMenuKind;
  x: number;
  y: number;
  /** whether the clipboard currently holds a node (controls 粘贴 enabled state) */
  canPaste: boolean;
  onAction: (action: CanvasMenuAction) => void;
  onClose: () => void;
}

export function ContextMenu({ kind, x, y, canPaste, onAction, onClose }: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const items = kind === "node" ? NODE_ITEMS : PANE_ITEMS;

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as HTMLElement)) onClose();
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [onClose]);

  // keep the menu inside the viewport (clamp both edges)
  const vw = typeof window !== "undefined" ? window.innerWidth : x + 248;
  const vh = typeof window !== "undefined" ? window.innerHeight : y + 240;
  const left = Math.max(8, Math.min(x, vw - 248));
  const top = Math.max(8, Math.min(y, vh - items.length * 40 - 24));

  return (
    <div
      ref={ref}
      role="menu"
      aria-label="画布菜单"
      className="fixed z-[1500] min-w-[14.5rem] rounded-lg border border-[rgba(74,96,119,0.14)] bg-[rgba(244,245,247,0.94)] px-1.5 py-1.5 text-[var(--canvas-text)] shadow-[0_18px_52px_rgba(28,42,58,0.18)] backdrop-blur-xl"
      style={{ left, top }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {items.map((item, i) =>
        item.separator ? (
          <div key={`sep-${i}`} role="separator" className="mx-2 my-1.5 h-px bg-[rgba(74,96,119,0.14)]" />
        ) : (
          <button
            key={item.action}
            type="button"
            role="menuitem"
            disabled={item.action === "paste" ? !canPaste : item.disabled}
            onClick={() => {
              if (!item.action || (item.action === "paste" ? !canPaste : item.disabled)) return;
              onAction(item.action);
              onClose();
            }}
            className={cn(
              "group flex min-h-9 w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[13px] leading-none transition hover:bg-white/[0.6] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-transparent",
              item.danger && "hover:bg-[#fef2f2]",
            )}
          >
            {item.icon && (
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0 text-[var(--canvas-text-muted)] transition group-hover:text-current",
                  item.danger && "group-hover:text-[#dc2626]",
                )}
              />
            )}
            <span className={cn("min-w-0 flex-1 truncate", item.danger && "group-hover:text-[#dc2626]")}>
              {item.label}
            </span>
            {item.hint && (
              <span className="ml-auto shrink-0 text-[11px] font-medium text-[var(--canvas-text-muted)]">
                {item.hint}
              </span>
            )}
          </button>
        ),
      )}
    </div>
  );
}
