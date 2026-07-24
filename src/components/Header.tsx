"use client";

import Link from "next/link";
import { FolderOpen, PanelLeft, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  collapsed?: boolean;
  onToggleSidebar?: () => void;
}

export function Header({ collapsed = false, onToggleSidebar }: Props) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 shadow-[0_1px_0_rgba(15,23,42,0.02)] backdrop-blur sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label={collapsed ? "展开侧边栏" : "收起侧边栏"}
          aria-pressed={collapsed}
          onClick={onToggleSidebar}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-[#0471FE] active:scale-95"
        >
          <PanelLeft className="h-4 w-4" />
        </button>

        <div className="min-w-0 border-l border-slate-200 pl-3">
          <div className="truncate text-[15px] font-bold leading-5 text-slate-950">
            丢抖AI素材工作台
          </div>
          <div className="mt-0.5 hidden truncate text-[11px] font-medium leading-4 text-slate-500 sm:block">
            超级编导 / 高级画布 / 爆款裂变 / 低成本成片 / 案例沉淀
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <PillLink icon={FolderOpen} label="文案/分镜库" href="/agent/ecommerce/library" />
        <PillLink icon={Settings2} label="设置" href="/agent/ecommerce/settings" />
      </div>
    </header>
  );
}

interface PillProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  href: string;
}

function PillLink({ icon: Icon, label, href }: PillProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-9 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-slate-200 bg-white px-3 text-[13px] font-semibold text-slate-700 shadow-sm transition-all outline-none hover:border-blue-200 hover:bg-blue-50 hover:text-[#0471FE] active:translate-y-px focus-visible:ring-2 focus-visible:ring-primary/30 max-sm:px-2.5",
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}
