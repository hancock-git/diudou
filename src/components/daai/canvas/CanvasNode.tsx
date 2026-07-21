"use client";

import { memo, useState } from "react";
import {
  Handle,
  Position,
  NodeResizer,
  type NodeProps,
  useReactFlow,
} from "@xyflow/react";
import { cn } from "@/lib/utils";
import { NODE_KIND_META, type CanvasNodeKind } from "@/lib/canvas-data";
import {
  TextNodeIcon,
  ImageNodeIcon,
  VideoNodeIcon,
  AudioNodeIcon,
} from "./icons";

export interface CanvasNodeData {
  kind: CanvasNodeKind;
  title: string;
  text?: string;
  src?: string;
  [key: string]: unknown;
}

const KIND_ICON = {
  markdown: TextNodeIcon,
  image: ImageNodeIcon,
  video: VideoNodeIcon,
  audio: AudioNodeIcon,
} as const;

/** The + affordance rendered inside each connection hotzone. */
function ConnectionPlus({ side, nodeId }: { side: "left" | "right"; nodeId: string }) {
  const shift = side === "left" ? -25 : 25;
  return (
    <div
      className="node-connection-hotzone absolute flex h-20 w-20 items-center justify-center rounded-full"
      style={{
        top: "50%",
        [side === "left" ? "right" : "left"]: 0,
        transform: "translateY(-50%)",
        cursor: "crosshair",
        pointerEvents: "auto",
      }}
      // click (no drag) quickly spawns a connected node on this side
      onClick={(e) => {
        e.stopPropagation();
        window.dispatchEvent(
          new CustomEvent("canvas:plus-click", {
            detail: { nodeId, side, x: e.clientX, y: e.clientY },
          }),
        );
      }}
    >
      <div
        className="node-connection-plus h-5 w-5 shrink-0 overflow-hidden rounded-full opacity-0 transition-all duration-150 ease-out group-hover/canvas-node-shell:opacity-100"
        style={{ transform: `translate(${shift}px, 0px) scale(1)` }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
          <circle cx="10" cy="10" r="9.35" fill="var(--canvas-handle-bg)" />
          <circle cx="10" cy="10" r="9.35" stroke="var(--canvas-handle-icon)" strokeWidth="1.2" />
          <path d="M10 6.5v7M6.5 10h7" stroke="var(--canvas-handle-icon)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

function NodeBody({
  kind,
  data,
  id,
}: {
  kind: CanvasNodeKind;
  data: CanvasNodeData;
  id: string;
}) {
  const { updateNodeData } = useReactFlow();
  const meta = NODE_KIND_META[kind];

  if (kind === "markdown") {
    return (
      <textarea
        className="nodrag h-full w-full resize-none bg-transparent px-2 py-2 text-xs leading-6 text-[var(--canvas-text)] outline-none placeholder:text-muted-foreground [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        placeholder={meta.placeholder}
        value={data.text ?? ""}
        onChange={(e) => updateNodeData(id, { text: e.target.value })}
      />
    );
  }

  if (kind === "image") {
    return data.src ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={data.src} alt="" className="h-full w-full object-cover" />
    ) : (
      <div className="flex h-full w-full items-center justify-center text-[var(--canvas-text-muted)]">
        <ImageNodeIcon className="h-9 w-9" />
      </div>
    );
  }

  if (kind === "video") {
    return (
      <div className="flex h-full w-full items-center justify-center text-[var(--canvas-text-muted)]">
        <VideoNodeIcon className="h-9 w-9" />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center text-[var(--canvas-text-muted)]">
      <AudioNodeIcon className="h-9 w-9" />
    </div>
  );
}

export const CanvasNode = memo(function CanvasNode({ id, data, selected }: NodeProps) {
  const nodeData = data as CanvasNodeData;
  const kind = nodeData.kind;
  const Icon = KIND_ICON[kind];
  const { updateNodeData } = useReactFlow();
  const [editingTitle, setEditingTitle] = useState(false);

  return (
    <div
      className="ui-canvas-node-shell group/canvas-node-shell relative h-full w-full"
      data-canvas-node-kind={kind}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={220}
        minHeight={160}
        lineClassName="!border-transparent"
        handleClassName="!h-2 !w-2 !rounded-[2px] !border !border-[rgba(39,39,42,0.55)] !bg-white"
      />

      {/* title row floats above the card */}
      <div
        className="node-card-title-row absolute left-0 z-20 flex w-full items-center gap-2"
        style={{ bottom: "calc(100% + 4px)" }}
      >
        <div className="inline-flex h-[24px] min-w-0 max-w-full items-center gap-1 px-1 text-[13px] font-medium text-[var(--canvas-text-muted)]">
          <Icon className="h-[1em] w-[1em] shrink-0" />
          {editingTitle ? (
            <input
              autoFocus
              className="nodrag min-w-0 flex-1 truncate bg-transparent outline-none"
              value={nodeData.title}
              onChange={(e) => updateNodeData(id, { title: e.target.value })}
              onBlur={() => setEditingTitle(false)}
              onKeyDown={(e) => e.key === "Enter" && setEditingTitle(false)}
            />
          ) : (
            <span
              className="min-w-0 flex-1 cursor-text truncate"
              onDoubleClick={() => setEditingTitle(true)}
            >
              {nodeData.title}
            </span>
          )}
        </div>
      </div>

      {/* card body */}
      <div
        className={cn(
          "canvas-node-card-body relative flex h-full w-full min-h-0 items-center justify-center overflow-hidden rounded-xl border border-solid bg-[var(--color-bg-muted)] transition-shadow",
          kind === "markdown"
            ? "border-[rgba(0,0,0,0.34)] bg-white"
            : "border-[rgba(0,0,0,0.12)] bg-white",
        )}
      >
        <NodeBody kind={kind} data={nodeData} id={id} />
      </div>

      {/* connection handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="node-connection-handle !z-20 !h-0 !w-0 !min-h-0 !min-w-0 !overflow-visible !border-0 !bg-transparent"
      >
        <ConnectionPlus side="left" nodeId={id} />
      </Handle>
      <Handle
        type="source"
        position={Position.Right}
        className="node-connection-handle !z-20 !h-0 !w-0 !min-h-0 !min-w-0 !overflow-visible !border-0 !bg-transparent"
      >
        <ConnectionPlus side="right" nodeId={id} />
      </Handle>
    </div>
  );
});
