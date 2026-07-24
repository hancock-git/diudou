"use client";

import { ADD_NODE_ITEMS, type CanvasNodeKind } from "@/lib/canvas-data";
import {
  TextNodeIcon,
  ImageNodeIcon,
  VideoNodeIcon,
  AudioNodeIcon,
  UploadIcon,
  AssetLibraryIcon,
} from "./icons";

const KIND_ICON = {
  markdown: TextNodeIcon,
  image: ImageNodeIcon,
  video: VideoNodeIcon,
  audio: AudioNodeIcon,
} as const;

interface AddNodeMenuProps {
  onSelect: (kind: CanvasNodeKind) => void;
  onResource?: (type: "upload" | "asset") => void;
}

/** The "添加节点 / 添加资源" card — shared by the left rail and the node + dots. */
export function AddNodeMenu({ onSelect, onResource }: AddNodeMenuProps) {
  return (
    <div className="w-[188px] rounded-2xl border border-[rgba(74,96,119,0.1)] bg-white/98 p-3 shadow-[0_18px_40px_rgba(31,45,61,0.14)] backdrop-blur-md">
      <p className="mb-1.5 px-1 text-[11px] text-[var(--canvas-text-muted)]">添加节点</p>
      <div className="flex flex-col">
        {ADD_NODE_ITEMS.map((item) => {
          const Icon = KIND_ICON[item.kind];
          return (
            <button
              key={item.kind}
              type="button"
              onClick={() => onSelect(item.kind)}
              className="flex items-center gap-2 rounded-lg px-2 py-2 text-[13px] text-[var(--canvas-text)] transition hover:bg-[#f4f5f7]"
            >
              <Icon className="h-4 w-4 text-[var(--canvas-text-muted)]" />
              {item.label}
            </button>
          );
        })}
      </div>
      <p className="mb-1.5 mt-2 px-1 text-[11px] text-[var(--canvas-text-muted)]">添加资源</p>
      <div className="flex flex-col">
        <button
          type="button"
          onClick={() => onResource?.("upload")}
          className="flex items-center gap-2 rounded-lg px-2 py-2 text-[13px] text-[var(--canvas-text)] transition hover:bg-[#f4f5f7]"
        >
          <UploadIcon className="h-4 w-4 text-[var(--canvas-text-muted)]" />
          从本地上传
        </button>
        <button
          type="button"
          onClick={() => onResource?.("asset")}
          className="flex items-center gap-2 rounded-lg px-2 py-2 text-[13px] text-[var(--canvas-text)] transition hover:bg-[#f4f5f7]"
        >
          <AssetLibraryIcon className="h-4 w-4 text-[var(--canvas-text-muted)]" />
          从资产库选择
        </button>
      </div>
    </div>
  );
}
