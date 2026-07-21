"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, ChevronDown, Check } from "lucide-react";
import { CREATION_MODES } from "@/lib/mock-data";
import type { CreationMode } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  value: CreationMode;
  onChange: (value: CreationMode) => void;
}

export function ModeSelector({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current =
    CREATION_MODES.find((m) => m.key === value) ?? CREATION_MODES[0];

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      {/* Trigger pill */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50",
          open && "border-slate-300",
        )}
      >
        <Sparkles className="h-4 w-4 text-primary" />
        <span>{current.label}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-slate-400 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {/* Dropdown panel */}
      {open ? (
        <div
          role="listbox"
          className="absolute bottom-full left-0 z-30 mb-2 w-60 rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_8px_30px_rgba(15,23,42,0.12)]"
        >
          <div className="px-2.5 py-1.5 text-xs text-slate-400">创作类型</div>
          {CREATION_MODES.map((m) => {
            const Icon = m.icon;
            const active = m.key === value;
            return (
              <button
                key={m.key}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(m.key);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition",
                  active ? "bg-slate-50" : "hover:bg-slate-50",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    active ? "text-primary" : "text-slate-500",
                  )}
                />
                <span
                  className={cn(
                    "flex-1 text-sm font-medium",
                    active ? "text-slate-950" : "text-slate-700",
                  )}
                >
                  {m.label}
                </span>
                {active ? <Check className="h-4 w-4 text-primary" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
