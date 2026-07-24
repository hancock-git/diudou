"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SIDEBAR_BOTTOM, SIDEBAR_NAV } from "@/lib/mock-data";
import type { SidebarBottomItem } from "@/types";

const BOTTOM_STYLES: Record<
  SidebarBottomItem["variant"],
  { bg: string; text: string; iconClr: string }
> = {
  credits: {
    bg: "bg-primary/5",
    text: "text-primary",
    iconClr: "text-primary",
  },
  billing: {
    bg: "bg-white shadow-[0_0_0_1px_rgba(4,113,254,0.15)]",
    text: "text-primary",
    iconClr: "text-primary",
  },
  logout: {
    bg: "bg-transparent hover:bg-slate-100",
    text: "text-slate-500",
    iconClr: "text-slate-500",
  },
};

interface Props {
  open?: boolean;
  collapsed?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open = false, collapsed = false, onClose }: Props) {
  const pathname = usePathname();

  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="关闭菜单"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex min-h-0 w-[min(82vw,280px)] shrink-0 flex-col border-r border-black/10 bg-white px-2 py-3 shadow-2xl shadow-black/15 transition-all duration-300 md:static md:z-auto md:w-[76px] md:translate-x-0 md:shadow-none",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          collapsed && "md:w-0 md:overflow-hidden md:border-r-0 md:px-0",
        )}
      >
        <Link
          href="/agent/ecommerce/home"
          className="flex shrink-0 items-center justify-center py-2 md:px-0"
          onClick={onClose}
        >
          <span className="group flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] bg-white p-1 shadow-[0_0_0_1px_rgba(4,113,254,0.15),0_10px_28px_0_rgba(37,99,235,0.16)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-md active:translate-y-0 active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none">
            <Image
              src="/brand/doudou-ai-mark.png"
              alt="丢抖AI"
              width={48}
              height={48}
              className="h-full w-full rounded-[14px] object-cover transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-110 group-hover:rotate-[-6deg] motion-reduce:transform-none motion-reduce:transition-none"
              priority
            />
          </span>
        </Link>

        <div className="mt-4 min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain pr-1 no-scrollbar">
          {SIDEBAR_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={onClose}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group/nav flex min-h-[58px] w-full flex-col items-center justify-center gap-1 rounded-[14px] px-1 py-2 text-[11px] font-medium transition-[transform,box-shadow,background-color,border-color,color] duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-md active:translate-y-0 active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none",
                  isActive
                    ? "bg-primary/10 text-primary shadow-[0_0_0_1px_rgba(4,113,254,0.15),0_1px_3px_0_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]"
                    : "text-slate-700 hover:bg-white",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 transition-transform duration-300 ease-out group-hover/nav:-translate-y-0.5 group-hover/nav:scale-110 group-hover/nav:rotate-[-6deg] motion-reduce:transform-none motion-reduce:transition-none",
                    isActive ? "text-primary" : "text-slate-500",
                  )}
                />
                <span className="max-w-full truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="mt-3 shrink-0 space-y-1 border-t border-slate-100 pt-3">
          {SIDEBAR_BOTTOM.map((item) => {
            const Icon = item.icon;
            const s = BOTTOM_STYLES[item.variant];
            const commonCls = cn(
              "group/bottom flex min-h-[58px] w-full flex-col items-center justify-center gap-1 rounded-[14px] px-1 py-2 text-[11px] font-medium transition-[transform,box-shadow,background-color] duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-md active:translate-y-0 active:scale-[0.98] motion-reduce:transform-none motion-reduce:transition-none",
              s.bg,
              s.text,
            );
            const inner = (
              <>
                <Icon
                  className={cn(
                    "h-4 w-4 transition-transform duration-300 ease-out group-hover/bottom:-translate-y-0.5 group-hover/bottom:scale-110 motion-reduce:transform-none motion-reduce:transition-none",
                    s.iconClr,
                  )}
                />
                <span className="max-w-full truncate">{item.label}</span>
              </>
            );
            if (item.href) {
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={onClose}
                  aria-label={item.description || item.label}
                  className={commonCls}
                >
                  {inner}
                </Link>
              );
            }
            return (
              <button
                key={item.key}
                type="button"
                aria-label={item.description || item.label}
                className={commonCls}
              >
                {inner}
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}
