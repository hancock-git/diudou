"use client";

import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  FileText,
  FileVideo,
  ImagePlus,
  LayoutPanelLeft,
  Wand2,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { cn } from "@/lib/utils";

interface ToolCard {
  title: string;
  desc: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  accent: string;
  glow: string;
}

const TOOL_CARDS: ToolCard[] = [
  {
    title: "超级编导",
    desc: "商品卖点提炼、脚本扩写、分镜拆解一站完成",
    href: "/agent/ecommerce/copywriting",
    icon: FileText,
    accent: "from-[#0471FE] to-[#56B6FF]",
    glow: "bg-[#0471FE]/12",
  },
  {
    title: "高级画布",
    desc: "自由编排素材、节点流程和批量创作任务",
    href: "/agent/ecommerce/canvas",
    icon: LayoutPanelLeft,
    accent: "from-[#7C3AED] to-[#B56BFF]",
    glow: "bg-[#7C3AED]/12",
  },
  {
    title: "爆款裂变",
    desc: "基于爆款素材快速生成多版本投流内容",
    href: "/agent/ecommerce/remix",
    icon: Wand2,
    accent: "from-[#FF3D8B] to-[#FF8A3D]",
    glow: "bg-[#FF3D8B]/12",
  },
  {
    title: "视频成片",
    desc: "脚本、素材、字幕自动组合成带货短视频",
    href: "/agent/ecommerce/video",
    icon: FileVideo,
    accent: "from-[#111827] to-[#64748B]",
    glow: "bg-slate-900/10",
  },
  {
    title: "AI生图",
    desc: "电商主图、场景图、商品详情图快速生成",
    href: "/agent/ecommerce/image",
    icon: ImagePlus,
    accent: "from-[#0EA5E9] to-[#22C55E]",
    glow: "bg-emerald-500/12",
  },
  {
    title: "资产库",
    desc: "沉淀商品素材、成品案例和投放创意资产",
    href: "/agent/ecommerce/assets",
    icon: Briefcase,
    accent: "from-[#F59E0B] to-[#EF4444]",
    glow: "bg-amber-500/12",
  },
];

export function EcommerceToolCards() {
  return (
    <section className="w-full pb-8 pt-1" aria-label="电商创作工具">
      <div className="mb-4 flex flex-col gap-1 sm:mb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-[17px] font-bold leading-6 text-[#0f1419]">电商创作工具</h2>
          <p className="mt-1 text-xs font-medium text-[#8a9099]">
            从脚本、画布到成片与资产管理，覆盖电商内容生产全流程。
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {TOOL_CARDS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.href}
              className="group relative min-h-[142px] overflow-hidden rounded-2xl border border-white/80 bg-white p-4 text-left shadow-[0_10px_34px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-100 hover:shadow-[0_18px_44px_rgba(15,23,42,0.10)]"
            >
              <span
                className={cn(
                  "pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl transition-transform duration-300 group-hover:scale-125",
                  item.glow,
                )}
              />
              <span className="relative flex items-start justify-between gap-3">
                <span
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg shadow-slate-200/80",
                    item.accent,
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-colors group-hover:bg-[#0471FE] group-hover:text-white">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </span>

              <span className="relative mt-4 block text-[15px] font-bold leading-5 text-[#0f1419]">
                {item.title}
              </span>
              <span className="relative mt-2 block text-xs font-medium leading-5 text-[#6b7280]">
                {item.desc}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
