"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, ShareIcon, ChatIcon } from "./icons";

interface TopbarProps {
  name: string;
  onNameChange: (v: string) => void;
  credits: number;
  dialogOpen: boolean;
  onToggleDialog: () => void;
}

export function Topbar({ name, onNameChange, credits, dialogOpen, onToggleDialog }: TopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as HTMLElement)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [menuOpen]);

  return (
    <header className="canvas-topbar pointer-events-none absolute inset-x-0 top-0 z-[1400] flex items-start justify-between gap-2 px-3 pt-3 sm:px-4">
      <div className="canvas-topbar-left-wrap flex min-w-0 items-center gap-1.5">
        <div className="canvas-topbar-left pointer-events-auto relative flex h-[38px] min-w-0 max-w-[calc(100vw-12rem)] items-center gap-1.5 rounded-xl border border-[rgba(74,96,119,0.12)] bg-[rgba(244,245,247,0.72)] px-1.5 shadow-[0_8px_26px_rgba(31,45,61,0.08)] backdrop-blur-md">
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              aria-label="打开项目菜单"
              onClick={() => setMenuOpen((v) => !v)}
              className="inline-flex h-[25px] shrink-0 items-center justify-center gap-1 rounded-lg px-1.5 text-[var(--canvas-text)] transition hover:bg-white/[0.58]"
            >
              <Image
                alt=""
                aria-hidden
                width={32}
                height={32}
                className="h-[22px] w-[22px] object-contain"
                src="/images/logo/da-ai.svg"
              />
              <ChevronDownIcon className="h-[11px] w-[11px] text-[var(--canvas-text-muted)]" />
            </button>
            {menuOpen && (
              <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-44 overflow-hidden rounded-xl border border-[rgba(74,96,119,0.14)] bg-white py-1 text-[13px] text-[var(--canvas-text)] shadow-[0_22px_60px_rgba(15,23,42,0.16)]">
                <Link href="/agent/ecommerce/canvas" className="block px-3 py-2 hover:bg-[#f4f5f7]">
                  返回画布列表
                </Link>
                <button className="block w-full px-3 py-2 text-left hover:bg-[#f4f5f7]">复制项目</button>
                <button className="block w-full px-3 py-2 text-left hover:bg-[#f4f5f7]">导出画布</button>
                <button className="block w-full px-3 py-2 text-left text-[#dc2626] hover:bg-[#fef2f2]">删除项目</button>
              </div>
            )}
          </div>

          <span className="h-[14px] w-px shrink-0 bg-[rgba(74,96,119,0.2)]" aria-hidden />

          <div className="inline-flex min-w-0 items-center">
            <input
              aria-label="画布名称"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="未命名画布"
              className="h-[25px] w-[120px] min-w-0 rounded-md border border-transparent bg-transparent px-1 text-[12px] font-semibold text-[var(--canvas-text)] outline-none transition placeholder:text-[var(--canvas-text-muted)] hover:bg-white/[0.4] focus:bg-white/[0.6]"
            />
          </div>
        </div>
      </div>

      <div className="pointer-events-auto flex h-[38px] items-center gap-1.5 rounded-xl border border-[rgba(74,96,119,0.12)] bg-[rgba(244,245,247,0.72)] px-1.5 text-[13px] shadow-[0_8px_26px_rgba(31,45,61,0.08)] backdrop-blur-md">
        <Link
          href="/account"
          aria-label="可用积分"
          className="inline-flex h-[26px] items-center gap-1 rounded-lg px-2 text-[var(--canvas-text)] transition hover:bg-white/[0.58]"
        >
          <span className="text-[#f5a623]">✦</span>
          <span className="tabular-nums">{credits}</span>
        </Link>
        <button
          type="button"
          aria-label="分享到发现"
          className="inline-flex h-[26px] items-center gap-1 rounded-lg px-2 text-[var(--canvas-text)] transition hover:bg-white/[0.58]"
        >
          <ShareIcon className="h-4 w-4" />
          <span>分享</span>
        </button>
        <button
          type="button"
          aria-label="打开画布对话"
          onClick={onToggleDialog}
          data-active={dialogOpen}
          className="inline-flex h-[26px] items-center gap-1 rounded-lg px-2 text-[var(--canvas-text)] transition hover:bg-white/[0.58] data-[active=true]:bg-white data-[active=true]:shadow-sm"
        >
          <ChatIcon className="h-4 w-4" />
          <span>对话</span>
        </button>
      </div>
    </header>
  );
}
