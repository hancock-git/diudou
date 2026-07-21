"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CANVAS_TUTORIALS, CANVAS_PROJECTS } from "@/lib/canvas-data";
import { ChevronDownIcon } from "./icons";

function PlayBadge() {
  return (
    <span className="tutorial-play-button absolute left-1/2 top-1/2 z-[3] flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-0 shadow-lg backdrop-blur-sm transition group-hover:bg-black/60 group-hover:opacity-100">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-6 w-6 translate-x-0.5">
        <path
          fillRule="evenodd"
          d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
          clipRule="evenodd"
        />
      </svg>
    </span>
  );
}

function ProjectActions() {
  return (
    <div className="absolute right-2 top-2 z-10 flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
      {[
        { key: "rename", label: "修改名称", d: "M16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Z" },
        { key: "copy", label: "复制项目", d: "M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m11.25 6.75h-1.875a1.125 1.125 0 0 1-1.125-1.125v-1.875" },
        { key: "share", label: "分享到发现", d: "M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" },
        { key: "delete", label: "删除项目", d: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" },
      ].map((a) => (
        <button
          key={a.key}
          aria-label={a.label}
          title={a.label}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-md bg-white/90 text-[#536471] shadow-sm transition hover:bg-white",
            a.key === "delete" && "hover:text-[#dc2626]",
          )}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-3.5 w-3.5" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d={a.d} />
          </svg>
        </button>
      ))}
    </div>
  );
}

export function CanvasLanding() {
  const [tutorialOpen, setTutorialOpen] = useState(true);

  return (
    <div className="w-full">
      {/* 新手教程 */}
      <section className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <h2 className="text-[17px] font-semibold text-[#0f1419]">新手教程</h2>
          <button
            aria-label={tutorialOpen ? "收起新手教程" : "展开新手教程"}
            onClick={() => setTutorialOpen((v) => !v)}
            className="flex h-6 w-6 items-center justify-center rounded-md text-[#536471] transition hover:bg-black/[0.04]"
          >
            <ChevronDownIcon className={cn("h-4 w-4 transition-transform", tutorialOpen && "rotate-180")} />
          </button>
        </div>
        {tutorialOpen && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {CANVAS_TUTORIALS.map((t) => (
              <button
                key={t.step}
                aria-label={`播放视频教程 ${t.step}`}
                className="group relative isolate aspect-[2/1] min-w-0 overflow-hidden rounded-2xl bg-white shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,0.1)]"
              >
                <div className="absolute inset-0 overflow-hidden rounded-[inherit] border border-black/[0.05]">
                  <Image
                    src={t.image}
                    alt={`视频教程 ${t.step}`}
                    fill
                    sizes="(max-width:640px) 100vw, (max-width:1280px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
                <PlayBadge />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* 我的创作 */}
      <section>
        <h2 className="mb-3 text-[17px] font-semibold text-[#0f1419]">我的创作</h2>
        <div className="grid gap-x-4 gap-y-6 [grid-template-columns:repeat(auto-fill,minmax(190px,1fr))]">
          {/* 新建 */}
          <div>
            <Link
              href="/agent/ecommerce/canvas/new"
              className="group flex aspect-square w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[#d4d7dd] bg-white text-[#536471] transition hover:border-[#0f1419]/40 hover:text-[#0f1419]"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="h-8 w-8" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </Link>
            <p className="mt-2 text-[13px] font-medium text-[#0f1419]">开始创作</p>
          </div>

          {/* projects */}
          {CANVAS_PROJECTS.map((p) => (
            <div key={p.id}>
              <Link
                href={`/agent/ecommerce/canvas/${p.id}`}
                aria-label={`打开画布「${p.name}」`}
                className="group relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-[#e4e4e7] bg-[#e9eaed] text-[13px] text-[#9aa0a8] transition hover:border-[#0f1419]/20 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
              >
                {p.preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.preview} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span>无预览</span>
                )}
                <ProjectActions />
              </Link>
              <p className="mt-2 truncate text-[13px] font-medium text-[#0f1419]">{p.name}</p>
              <time className="text-[12px] text-[#9aa0a8]">{p.updatedAt}</time>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
