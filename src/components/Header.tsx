"use client";

import Link from "next/link";
import { FolderOpen, PanelLeft, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onToggleSidebar?: () => void;
}

export function Header({ onToggleSidebar }: Props) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-black/10 bg-white px-3 sm:h-[58px] sm:px-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="切换侧边栏"
          onClick={onToggleSidebar}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <PanelLeft className="h-4 w-4" />
        </button>
        <div>
          <div className="text-sm font-semibold text-slate-950">
            丢抖AI素材工作台
          </div>
          <div className="text-[11px] text-slate-500">
            超级编导 / 高级画布 / 爆款裂变 / 低成本成片 / 案例沉淀
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
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
        "inline-flex h-7 shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-full border border-slate-200 bg-white px-2.5 text-[0.8rem] font-medium text-slate-700 transition-all outline-none hover:bg-slate-50 hover:text-slate-900 active:translate-y-px focus-visible:ring-2 focus-visible:ring-primary/30",
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </Link>
  );
}
