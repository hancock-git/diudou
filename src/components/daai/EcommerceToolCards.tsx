"use client";

import Link from "next/link";
import {
  ArrowRight,
  ImagePlus,
  Maximize2,
  Scissors,
  Shirt,
  Sparkles,
  UserRound,
  Wand2,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { cn } from "@/lib/utils";

interface FeatureCard {
  title: string;
  desc: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  surface: string;
}

const FEATURES: FeatureCard[] = [
  {
    title: "水印擦除",
    desc: "智能擦除视频水印与遮挡元素",
    href: "/agent/ecommerce/video",
    icon: Wand2,
    surface: "border-[#f4dfbc] bg-[#fff3db]",
  },
  {
    title: "字幕擦除",
    desc: "一键去除视频字幕与画面文字",
    href: "/agent/ecommerce/video",
    icon: Scissors,
    surface: "border-[#d5e5f8] bg-[#e7f1ff]",
  },
  {
    title: "画质增强",
    desc: "提升视频清晰度与画面质感",
    href: "/agent/ecommerce/video",
    icon: Maximize2,
    surface: "border-[#f2d7ea] bg-[#ffeaf7]",
  },
  {
    title: "爆款裂变",
    desc: "快速裂变多条爆款投流视频",
    href: "/agent/ecommerce/remix",
    icon: Sparkles,
    surface: "border-[#e2d7f7] bg-[#f3eaff]",
  },
  {
    title: "数字分身",
    desc: "上传人物照片，生成自然口播视频",
    href: "/agent/ecommerce/video",
    icon: UserRound,
    surface: "border-[#f5d7d7] bg-[#ffe7e8]",
  },
  {
    title: "模特换衣",
    desc: "上传模特与服装图，快速生成试穿效果",
    href: "/agent/ecommerce/image",
    icon: Shirt,
    surface: "border-[#eadfce] bg-[#fffaf2]",
  },
];

export function EcommerceToolCards() {
  return (
    <section className="w-full pb-8 pt-1" aria-label="电商创作工具">
      <div className="rounded-[18px] border border-slate-200/90 bg-white p-4 shadow-[0_8px_26px_rgba(15,23,42,0.06)]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-base font-extrabold leading-5 text-slate-950">
              电商创作工具
            </h2>
            <p className="mt-0.5 text-xs font-medium leading-4 text-slate-500">
              从素材处理到商品内容生成，一站式完成
            </p>
          </div>
          <span className="hidden w-fit shrink-0 items-center rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold leading-4 text-blue-600 sm:inline-flex">
            7 项实用功能
          </span>
        </div>

        <div className="mt-4 grid gap-3 xl:grid-cols-[minmax(320px,0.92fr)_minmax(0,1.38fr)]">
          <Link
            href="/agent/ecommerce/image"
            className="group relative min-h-[176px] overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-[#f2f7ff] via-[#eef4ff] to-[#dbe8ff] p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(37,99,235,0.10)]"
          >
            <div className="relative z-10 flex min-h-[136px] flex-col">
              <div>
                <h3 className="text-xl font-black leading-7 text-slate-950">商详套图</h3>
                <p className="mt-2 text-xs font-medium leading-5 text-slate-600">
                  一键生成专业电商详情套图
                </p>
              </div>

              <span className="mt-auto inline-flex h-9 w-fit items-center gap-1.5 rounded-lg bg-slate-950 px-3 text-xs font-bold text-white shadow-[0_10px_22px_rgba(3,8,23,0.15)] transition-transform duration-300 group-hover:translate-x-0.5">
                立即创作
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>

            <div className="pointer-events-none absolute bottom-3 right-4 h-[104px] w-[142px] rotate-[-5deg] rounded-2xl border border-white/80 bg-white/75 shadow-[0_16px_34px_rgba(71,85,105,0.16)] backdrop-blur-sm transition-transform duration-300 group-hover:rotate-[-3deg] group-hover:scale-[1.02] max-[420px]:right-1 max-[420px]:opacity-45">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white via-white to-[#dcecff]" />
              <ImagePlus className="absolute left-1/2 top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2 text-[#3b82ff]" />
            </div>
          </Link>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className={cn(
                    "group flex min-h-[82px] items-center gap-3 rounded-xl border p-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(15,23,42,0.08)]",
                    feature.surface,
                  )}
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/75 text-[#344255] shadow-[0_8px_18px_rgba(15,23,42,0.10)] ring-1 ring-white/70 transition-transform duration-300 group-hover:scale-[1.04]">
                    <Icon className="h-6 w-6 stroke-[2.2]" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-black leading-5 text-slate-950">
                      {feature.title}
                    </span>
                    <span className="mt-1 block text-[11px] font-medium leading-4 text-slate-600">
                      {feature.desc}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
