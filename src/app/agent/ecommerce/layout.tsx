"use client";

import { usePathname } from "next/navigation";
import { WorkspaceShell } from "@/components/WorkspaceShell";

export default function EcommerceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Only the full-screen canvas editor (`/canvas/<id>`) brings its own chrome
  // and skips the workspace shell. The canvas landing (`/canvas`) stays inside
  // the shell so it shares the same sidebar menu as the rest of the workspace.
  if (pathname?.startsWith("/agent/ecommerce/canvas/")) {
    return <>{children}</>;
  }
  return <WorkspaceShell>{children}</WorkspaceShell>;
}
