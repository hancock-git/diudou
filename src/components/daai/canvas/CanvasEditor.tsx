"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  ConnectionMode,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  type Node,
  type Edge,
  type Connection,
  type Viewport,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { cn } from "@/lib/utils";
import { NODE_KIND_META, type CanvasNodeKind } from "@/lib/canvas-data";
import { CanvasNode, type CanvasNodeData } from "./CanvasNode";
import { Topbar } from "./Topbar";
import { LeftToolbar, type CanvasTool } from "./LeftToolbar";
import { BottomControls } from "./BottomControls";
import { SelectionInspector, type InspectorAnchor } from "./SelectionInspector";
import { DialogDrawer } from "./DialogDrawer";
import { TemplatesPanel } from "./TemplatesPanel";
import { ContextMenu, type CanvasMenuKind, type CanvasMenuAction } from "./ContextMenu";
import { AddNodeMenu } from "./AddNodeMenu";

const nodeTypes = { canvas: CanvasNode };

const NODE_SIZE: Record<CanvasNodeKind, { width: number; height: number }> = {
  markdown: { width: 320, height: 220 },
  image: { width: 320, height: 220 },
  video: { width: 360, height: 220 },
  audio: { width: 320, height: 140 },
};

let nodeSeq = 1;
function makeNode(kind: CanvasNodeKind, position: { x: number; y: number }): Node<CanvasNodeData> {
  const size = NODE_SIZE[kind];
  return {
    id: `node-${Date.now()}-${nodeSeq++}`,
    type: "canvas",
    position,
    width: size.width,
    height: size.height,
    data: { kind, title: NODE_KIND_META[kind].title, text: "" },
  };
}

function EditorInner({ projectName }: { projectName: string }) {
  const rf = useReactFlow<Node<CanvasNodeData>, Edge>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<CanvasNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const [tool, setTool] = useState<CanvasTool>("cursor");
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [minimapOn, setMinimapOn] = useState(false);
  const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, zoom: 1 });
  const [name, setName] = useState(projectName);
  const [ctx, setCtx] = useState<{ kind: CanvasMenuKind; x: number; y: number; nodeId?: string } | null>(null);
  const [plusMenu, setPlusMenu] = useState<{
    fromNodeId: string;
    side: "left" | "right";
    x: number;
    y: number;
  } | null>(null);
  const clipboardRef = useRef<Node<CanvasNodeData> | null>(null);

  // create a new node of the chosen kind on the given side of a node, and connect them
  const spawnConnectedNode = useCallback(
    (fromNodeId: string, side: "left" | "right", kind: CanvasNodeKind) => {
      const from = rf.getNode(fromNodeId) as Node<CanvasNodeData> | undefined;
      if (!from) return;
      const w = from.width ?? from.measured?.width ?? NODE_SIZE[from.data.kind].width;
      const size = NODE_SIZE[kind];
      const pos =
        side === "right"
          ? { x: from.position.x + w + 80, y: from.position.y }
          : { x: from.position.x - size.width - 80, y: from.position.y };
      const newNode = makeNode(kind, pos);
      setNodes((nds) =>
        nds.map((n): Node<CanvasNodeData> => ({ ...n, selected: false })).concat({ ...newNode, selected: true }),
      );
      setEdges((eds) =>
        eds.concat({
          id: `e-${fromNodeId}-${newNode.id}`,
          source: side === "right" ? fromNodeId : newNode.id,
          target: side === "right" ? newNode.id : fromNodeId,
          type: "default",
        }),
      );
    },
    [rf, setNodes, setEdges],
  );

  const spawnCopy = useCallback(
    (src: Node<CanvasNodeData>, at?: { x: number; y: number }) => {
      const copy: Node<CanvasNodeData> = {
        ...src,
        id: `node-${Date.now()}-${nodeSeq++}`,
        position: at ?? { x: src.position.x + 40, y: src.position.y + 40 },
        selected: true,
        data: { ...src.data },
      };
      setNodes((nds) =>
        nds.map((n): Node<CanvasNodeData> => ({ ...n, selected: false })).concat(copy),
      );
    },
    [setNodes],
  );

  const handleMenuAction = useCallback(
    (action: CanvasMenuAction) => {
      const nodeId = ctx?.nodeId;
      switch (action) {
        case "delete":
          if (nodeId) {
            setNodes((nds) => nds.filter((n) => n.id !== nodeId));
            setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
          }
          break;
        case "duplicate":
          if (nodeId) {
            const n = rf.getNode(nodeId);
            if (n) spawnCopy(n as Node<CanvasNodeData>);
          }
          break;
        case "copy":
          if (nodeId) {
            const n = rf.getNode(nodeId);
            if (n) clipboardRef.current = n as Node<CanvasNodeData>;
          }
          break;
        case "paste":
          if (clipboardRef.current && ctx) {
            const flow = rf.screenToFlowPosition({ x: ctx.x, y: ctx.y });
            const size = NODE_SIZE[clipboardRef.current.data.kind];
            spawnCopy(clipboardRef.current, { x: flow.x - size.width / 2, y: flow.y - size.height / 2 });
          }
          break;
        // save / asset / upload / undo — mock, no-op
        default:
          break;
      }
    },
    [ctx, rf, setEdges, setNodes, spawnCopy],
  );

  const onConnect = useCallback(
    (c: Connection) => setEdges((eds) => addEdge({ ...c, type: "default" }, eds)),
    [setEdges],
  );

  // clicking a node's + connection dot opens the "添加节点" type menu at the cursor
  useEffect(() => {
    const handler = (ev: Event) => {
      const { nodeId, side, x, y } = (ev as CustomEvent).detail as {
        nodeId: string;
        side: "left" | "right";
        x: number;
        y: number;
      };
      setAddMenuOpen(false);
      setTemplatesOpen(false);
      setCtx(null);
      setPlusMenu({ fromNodeId: nodeId, side, x, y });
    };
    window.addEventListener("canvas:plus-click", handler);
    return () => window.removeEventListener("canvas:plus-click", handler);
  }, []);

  // Ctrl/Cmd + C / V copy & paste the selected node
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "TEXTAREA" || t.tagName === "INPUT" || t.isContentEditable)) return;
      if (!(e.ctrlKey || e.metaKey)) return;
      const key = e.key.toLowerCase();
      if (key === "c") {
        const sel = rf.getNodes().find((n) => n.selected);
        if (sel) clipboardRef.current = sel as Node<CanvasNodeData>;
      } else if (key === "v" && clipboardRef.current) {
        e.preventDefault();
        const rect = wrapperRef.current?.getBoundingClientRect();
        const center = rect
          ? rf.screenToFlowPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
          : { x: 0, y: 0 };
        const size = NODE_SIZE[clipboardRef.current.data.kind];
        spawnCopy(clipboardRef.current, { x: center.x - size.width / 2, y: center.y - size.height / 2 });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [rf, spawnCopy]);

  const addNodeAtCenter = useCallback(
    (kind: CanvasNodeKind) => {
      const rect = wrapperRef.current?.getBoundingClientRect();
      const center = rect
        ? rf.screenToFlowPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
        : { x: 0, y: 0 };
      const size = NODE_SIZE[kind];
      setNodes((nds) => {
        const offset = nds.length * 28;
        const node = makeNode(kind, {
          x: center.x - size.width / 2 + offset,
          y: center.y - size.height / 2 + offset,
        });
        return nds.map((n) => ({ ...n, selected: false })).concat({ ...node, selected: true });
      });
      setAddMenuOpen(false);
    },
    [rf, setNodes],
  );

  const onPaneDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      // only add a card when double-clicking empty canvas, never on a node
      if ((e.target as HTMLElement).closest(".react-flow__node")) return;
      const pos = rf.screenToFlowPosition({ x: e.clientX, y: e.clientY });
      const size = NODE_SIZE.markdown;
      const node = makeNode("markdown", { x: pos.x - size.width / 2, y: pos.y - size.height / 2 });
      setNodes((nds) => nds.map((n) => ({ ...n, selected: false })).concat({ ...node, selected: true }));
    },
    [rf, setNodes],
  );

  const autoArrange = useCallback(() => {
    const cols = Math.max(1, Math.ceil(Math.sqrt(nodes.length)));
    const gapX = 380;
    const gapY = 300;
    setNodes((nds) =>
      nds.map((n, i) => ({
        ...n,
        position: { x: (i % cols) * gapX, y: Math.floor(i / cols) * gapY },
      })),
    );
    requestAnimationFrame(() => rf.fitView({ padding: 0.2, duration: 300 }));
  }, [nodes.length, rf, setNodes]);

  const selectedNode = useMemo(() => {
    const sel = nodes.filter((n) => n.selected);
    return sel.length === 1 ? sel[0] : null;
  }, [nodes]);

  const inspectorAnchor: InspectorAnchor | null = useMemo(() => {
    if (!selectedNode) return null;
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const w = selectedNode.width ?? selectedNode.measured?.width ?? NODE_SIZE[selectedNode.data.kind].width;
    const h = selectedNode.height ?? selectedNode.measured?.height ?? NODE_SIZE[selectedNode.data.kind].height;
    const tl = rf.flowToScreenPosition({ x: selectedNode.position.x, y: selectedNode.position.y });
    const br = rf.flowToScreenPosition({ x: selectedNode.position.x + w, y: selectedNode.position.y + h });
    return {
      left: tl.x - rect.left,
      top: tl.y - rect.top,
      width: br.x - tl.x,
      bottom: br.y - rect.top,
    };
    // recompute when viewport changes too
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNode, viewport, rf]);

  const updateSelectedText = useCallback(
    (v: string) => {
      if (!selectedNode) return;
      rf.updateNodeData(selectedNode.id, { text: v });
    },
    [rf, selectedNode],
  );

  return (
    <div className="relative flex h-dvh w-full overflow-hidden bg-[var(--color-bg)]">
      <div ref={wrapperRef} className="relative min-w-0 flex-1">
        <ReactFlow
          className={cn("canvas-flow", tool === "hand" && "canvas-flow-hand")}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          connectOnClick={false}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onMove={(_, vp) => setViewport(vp)}
          onInit={(inst) => setViewport(inst.getViewport())}
          onDoubleClick={onPaneDoubleClick}
          onPaneClick={() => {
            setAddMenuOpen(false);
            setTemplatesOpen(false);
            setCtx(null);
            setPlusMenu(null);
          }}
          onNodeContextMenu={(e, node) => {
            e.preventDefault();
            setNodes((nds) => nds.map((n): Node<CanvasNodeData> => ({ ...n, selected: n.id === node.id })));
            setCtx({ kind: "node", x: e.clientX, y: e.clientY, nodeId: node.id });
          }}
          onPaneContextMenu={(e) => {
            e.preventDefault();
            const ev = e as unknown as MouseEvent;
            setCtx({ kind: "pane", x: ev.clientX, y: ev.clientY });
          }}
          minZoom={0.2}
          maxZoom={2.5}
          panOnDrag
          selectionOnDrag={false}
          nodesDraggable={tool !== "hand"}
          zoomOnScroll
          zoomOnDoubleClick={false}
          proOptions={{ hideAttribution: true }}
          deleteKeyCode={["Backspace", "Delete"]}
        >
          <Background variant={BackgroundVariant.Dots} gap={18} size={1.4} color="rgba(39,59,80,0.16)" />
          {minimapOn && (
            <MiniMap
              pannable
              zoomable
              className="!bottom-16 !left-4 !m-0 overflow-hidden rounded-xl border border-[rgba(74,96,119,0.12)] shadow-[0_8px_26px_rgba(31,45,61,0.1)]"
              nodeColor="#d4d4d8"
              maskColor="rgba(244,244,245,0.6)"
            />
          )}
        </ReactFlow>

        {/* empty state */}
        {nodes.length === 0 && (
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-[1] flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-white/70 px-5 py-3 text-[13px] text-[var(--canvas-text-muted)] shadow-[0_8px_26px_rgba(31,45,61,0.06)]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Z" />
            </svg>
            双击画布添加新卡片
          </div>
        )}

        <Topbar
          name={name}
          onNameChange={setName}
          credits={0}
          dialogOpen={dialogOpen}
          onToggleDialog={() => setDialogOpen((v) => !v)}
        />

        <LeftToolbar
          tool={tool}
          addMenuOpen={addMenuOpen}
          templatesOpen={templatesOpen}
          onSelectTool={(t) => {
            setTool(t);
            setAddMenuOpen(false);
          }}
          onToggleAddMenu={() => {
            setAddMenuOpen((v) => !v);
            setTemplatesOpen(false);
          }}
          onToggleTemplates={() => {
            setTemplatesOpen((v) => !v);
            setAddMenuOpen(false);
          }}
          onAddNode={addNodeAtCenter}
        />

        {templatesOpen && <TemplatesPanel onClose={() => setTemplatesOpen(false)} />}

        <BottomControls
          zoom={viewport.zoom}
          minimapOn={minimapOn}
          onToggleMinimap={() => setMinimapOn((v) => !v)}
          onAutoArrange={autoArrange}
          onZoomIn={() => rf.zoomIn({ duration: 200 })}
          onZoomOut={() => rf.zoomOut({ duration: 200 })}
          onReset={() => rf.setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 300 })}
        />

        {selectedNode && inspectorAnchor && (
          <SelectionInspector
            key={selectedNode.id}
            kind={selectedNode.data.kind}
            text={selectedNode.data.text ?? ""}
            anchor={inspectorAnchor}
            onTextChange={updateSelectedText}
          />
        )}
      </div>

      {dialogOpen && (
        <div className="h-dvh w-[min(420px,42vw)] shrink-0">
          <DialogDrawer onClose={() => setDialogOpen(false)} />
        </div>
      )}

      {ctx && (
        <ContextMenu
          kind={ctx.kind}
          x={ctx.x}
          y={ctx.y}
          canPaste={clipboardRef.current !== null}
          onAction={handleMenuAction}
          onClose={() => setCtx(null)}
        />
      )}

      {plusMenu && (
        <>
          <div
            className="fixed inset-0 z-[1490]"
            onPointerDown={() => setPlusMenu(null)}
            onContextMenu={(e) => {
              e.preventDefault();
              setPlusMenu(null);
            }}
          />
          <div
            className="fixed z-[1500]"
            style={{
              left: Math.max(8, Math.min(plusMenu.x, (typeof window !== "undefined" ? window.innerWidth : 9999) - 200)),
              top: Math.max(8, Math.min(plusMenu.y, (typeof window !== "undefined" ? window.innerHeight : 9999) - 320)),
            }}
          >
            <AddNodeMenu
              onSelect={(kind) => {
                spawnConnectedNode(plusMenu.fromNodeId, plusMenu.side, kind);
                setPlusMenu(null);
              }}
              onResource={() => setPlusMenu(null)}
            />
          </div>
        </>
      )}
    </div>
  );
}

export function CanvasEditor({ projectName = "未命名画布" }: { projectName?: string }) {
  return (
    <ReactFlowProvider>
      <EditorInner projectName={projectName} />
    </ReactFlowProvider>
  );
}
