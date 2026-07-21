import { CanvasEditor } from "@/components/daai/canvas/CanvasEditor";
import { CANVAS_PROJECTS } from "@/lib/canvas-data";

export default async function CanvasEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = CANVAS_PROJECTS.find((p) => p.id === id);
  return <CanvasEditor projectName={project?.name ?? "未命名画布"} />;
}
