"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { FolderOpen, Film, ImageIcon, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { DISCOVER_ITEMS, DISCOVER_TABS, type DiscoverTabKey } from "@/lib/daai-data";

export function DiscoverFeed() {
  const [tab, setTab] = useState<DiscoverTabKey>("all");

  const items = useMemo(
    () => (tab === "all" ? DISCOVER_ITEMS : DISCOVER_ITEMS.filter((it) => it.kind === tab)),
    [tab],
  );

  const counts = useMemo(
    () => ({
      video: DISCOVER_ITEMS.filter((it) => it.kind === "video").length,
      image: DISCOVER_ITEMS.filter((it) => it.kind === "image").length,
    }),
    [],
  );

  return (
    <section className="w-full pb-12 pt-2" aria-label="发现内容">
      <div className="w-full">
        <header className="mb-5 flex flex-col gap-3 sm:mb-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#0f1419]">成品展示</h2>
            <p className="mt-1 text-xs text-[#8a9099]">视频成片优先展示，图片成品随后呈现。</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* 分段式 tab */}
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1">
              {DISCOVER_TABS.map((t) => {
                const active = tab === t.key;
                const count = t.key === "video" ? counts.video : t.key === "image" ? counts.image : undefined;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setTab(t.key)}
                    className={cn(
                      "flex h-8 items-center gap-1 rounded-md px-3 text-xs font-medium transition",
                      active ? "bg-white text-[#0f1419] shadow-sm" : "text-[#8a9099] hover:text-[#0f1419]",
                    )}
                  >
                    <span>{t.label}</span>
                    {count !== undefined && <span className="text-[#b4b8bf]">{count}</span>}
                  </button>
                );
              })}
            </div>

            {/* 查看全部 */}
            <button
              type="button"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-[#4c535c] transition-colors hover:bg-slate-50 hover:text-[#0f1419]"
            >
              <FolderOpen className="h-3.5 w-3.5" />
              查看全部
            </button>
          </div>
        </header>

        {/* Masonry waterfall（da-ai.cc 发现流布局：封面 + 底部渐变遮罩 + 覆盖信息条） */}
        <div className="[column-fill:_balance] columns-2 gap-3 sm:columns-3 lg:columns-4 xl:columns-5">
          {items.map((item) => {
            const TypeIcon = item.kind === "video" ? Film : ImageIcon;
            return (
              <article
                key={item.id}
                className="group relative mb-3 block min-w-0 break-inside-avoid overflow-hidden rounded-2xl bg-[#EBEBEB] text-left shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,23,42,0.1)]"
              >
                <div className="relative w-full overflow-hidden" style={{ aspectRatio: item.aspect }}>
                  <Image
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                    src={item.src}
                  />
                </div>

                {/* 底部渐变遮罩 */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-20 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />

                {/* 覆盖信息条：类型图标 + 标题 + 右下角点赞 */}
                <div className="absolute inset-x-2.5 bottom-2.5 z-10 flex items-center gap-2 text-white">
                  <span className="flex min-w-0 flex-1 items-center gap-1.5 text-[11px] leading-none">
                    <TypeIcon className="h-4 w-4 shrink-0 drop-shadow-[0_1px_3px_rgba(0,0,0,0.65)]" />
                    <span className="truncate drop-shadow-[0_1px_3px_rgba(0,0,0,0.65)]">{item.title}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1 text-[11px] leading-none tabular-nums drop-shadow-[0_1px_3px_rgba(0,0,0,0.65)]">
                    <Heart className="h-3.5 w-3.5" />
                    {item.likes}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
