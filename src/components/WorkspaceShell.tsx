"use client";

import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

interface Props {
  children: React.ReactNode;
}

export function WorkspaceShell({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleToggleSidebar = () => {
    if (typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches) {
      setSidebarCollapsed((v) => !v);
      return;
    }
    setSidebarOpen((v) => !v);
  };

  return (
    <div className="flex h-dvh overflow-hidden bg-white text-foreground">
      <Sidebar
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
      />

      <section className="flex min-w-0 flex-1 flex-col">
        <Header collapsed={sidebarCollapsed} onToggleSidebar={handleToggleSidebar} />

        <main className="relative flex min-h-0 flex-1 flex-col bg-workspace">
          <div className="flex-1 overflow-y-auto px-3 pt-5 sm:px-5 sm:pt-7 lg:px-8">
            <div className="mx-auto w-full max-w-shell space-y-4 pb-8 text-left">
              {children}
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}
