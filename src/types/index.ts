import type { ComponentType, SVGProps } from "react";

export type LucideIcon = ComponentType<SVGProps<SVGSVGElement>>;

export interface SidebarNavItem {
  key: string;
  label: string;
  icon: LucideIcon;
  href: string;
}

export interface SidebarBottomItem {
  key: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  variant: "credits" | "billing" | "logout";
  href?: string;
}

export type CreationMode = "copy" | "rewrite" | "storyboard";

export interface CreationModeItem {
  key: CreationMode;
  label: string;
  desc: string;
  icon: LucideIcon;
}

export type ExtractTabKey = "link" | "video" | "image" | "voice" | "audio";

export interface ExtractTab {
  key: ExtractTabKey;
  label: string;
  icon: LucideIcon;
}

export type ShowcaseTabKey = "all" | "video" | "image";

export interface ShowcaseTab {
  key: ShowcaseTabKey;
  label: string;
  count?: number;
}

export type MediaAspect = "4/5" | "3/4" | "square";

export interface ShowcaseItem {
  id: string;
  kind: "video" | "image";
  title: string;
  date: string;
  aspect: MediaAspect;
  /** Local path in /public. For videos, `poster` is the fallback thumbnail. */
  src: string;
  poster?: string;
}
