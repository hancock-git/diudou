# 丢抖AI 电商工作台 — Dashboard Specification

Single-page dashboard clone of `http://124.174.43.52/agent/ecommerce/home`.

## Overview
- **Framework:** Next.js 16 App Router (React 19, TypeScript strict, Tailwind v4)
- **Screenshots:** `docs/design-references/home-desktop-1440.png` (original), `clone-final-desktop.png` (clone)
- **Interaction model:** static layout + click-driven tab switching + click-driven segmented filter

## Page Topology (top → bottom, left → right)

```
<body bg-#f4f4f5>
  <div flex h-dvh bg-white>
    <aside 76px>  Sidebar
      Logo (h-14 w-14 rounded-[18px] blue glow shadow)
      Nav: 首页(active)/超级编导/高级画布/爆款裂变/视频成片/AI生图/资产库/账号与设置/管理面板
      Bottom: 无限(primary chip) / 订阅 / 退出
    <section flex-1>
      <header h-[58px] bg-white border-b>
        left: PanelLeft icon + title "丢抖AI素材工作台" + subtitle
        right: 文案/分镜库 pill + 设置 pill
      <main bg-#f6f8fb overflow-y-auto>
        <div max-w-1680 mx-auto space-y-4 pb-8>
          ExtractCard          — 文案提取
          ShowcaseCard         — 成品展示 (masonry columns-2 md:columns-3 xl:columns-4 2xl:columns-5)
```

## Design Tokens (extracted with `getComputedStyle`)

| Token | Value |
|-------|-------|
| Body bg | `#f4f4f5` (zinc-100) |
| Text (foreground) | `#18181b` (zinc-900) |
| Workspace bg | `#f6f8fb` |
| Card bg | `#ffffff` |
| Border | `#e2e8f0` (slate-200) |
| Primary | `#0471fe` |
| Slate-500 | `#64748b` |
| Slate-700 | `#334155` |
| Slate-950 | `#020617` (dark cards) |
| Font | `ui-sans-serif, system-ui, -apple-system, "system-ui", "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif` |
| Base font size | 16px |
| Card border radius | 14px (rounded-xl) / 18px (rounded-2xl) |

## Sidebar (`src/components/Sidebar.tsx`)

- Width: `76px` on `md:`, `min(82vw,280px)` drawer on mobile with `fixed inset-y-0 z-50 shadow-2xl`
- Icon+label buttons: `h-[58px]` min height, `rounded-[14px]`, 11px label
- Active state: `bg-primary/10 text-primary` with `shadow-[0_0_0_1px_rgba(4,113,254,0.15),...]`
- Hover animation: `-translate-y-0.5 scale-[1.03] shadow-md` (`transition-[transform,box-shadow,...] duration-300 ease-out`)
- Icons: rotate `-6deg` and scale `110%` on hover
- Bottom section: separated by `border-t border-slate-100 pt-3`
  - `无限` uses `bg-primary/5 text-primary`
  - `订阅` uses white background with primary ring
  - `退出` uses slate-500 with hover slate-100

## Header (`src/components/Header.tsx`)

- `h-14 sm:h-[58px]` white bar with `border-b border-black/10`
- Left cluster: PanelLeft toggle (9x9 slate-600) + title `text-sm font-semibold` + subtitle `text-[11px] text-slate-500`
- Right cluster: 2 pill buttons `h-7 rounded-full border-slate-200 bg-white gap-1 px-2.5 text-[0.8rem]`
- Sidebar toggle wired to state on desktop and mobile

## ExtractCard (`src/components/ExtractCard.tsx`)

- Wrapper: `rounded-xl border-slate-200 bg-white p-2.5 shadow-sm`
- Header row: `文案提取` label + 5 pills `h-7 rounded-full` (link/video/image/voice/audio)
  - Active: `bg-primary text-white shadow-sm`
  - Inactive: `bg-slate-100 text-slate-600 hover:bg-slate-200`
- Body: `grid gap-2 xl:grid-cols-[minmax(260px,0.78fr)_minmax(0,1fr)]`
  - Left panel `bg-slate-50` with tab label + primary CTA + textarea `h-[56px] text-xs`
  - Right panel `bg-white` with 4 result actions (保存到资产库/脚本改写/复制/快速成片) + textarea `bg-slate-50 text-slate-700`
- **Interaction:** click a tab pill to switch active state; label + placeholder + right-side chip all update

## ShowcaseCard (`src/components/ShowcaseCard.tsx`)

- Wrapper: `rounded-2xl border-slate-200 bg-white p-4 shadow-sm`
- Header row: h2 `text-base font-semibold` + p `text-xs text-slate-500` on left; segmented tab + 查看全部 pill on right
- Segmented tab: `inline-flex rounded-lg border-slate-200 bg-slate-100 p-1`
  - Active: `h-8 rounded-md bg-white text-slate-950 shadow-sm`
  - Inactive: `text-slate-500 hover:text-slate-900`
- Grid: `columns-2 gap-3 md:columns-3 xl:columns-4 2xl:columns-5` (CSS multi-column masonry)
- Tile (button):
  - `mb-3 block break-inside-avoid overflow-hidden rounded-lg border-slate-200 bg-slate-950 shadow-sm`
  - Hover: `-translate-y-0.5 border-slate-300 shadow-md`, image `scale-[1.02]`
  - Aspect ratios: `aspect-[4/5]` | `aspect-[3/4]` | `aspect-square` (per item)
  - Image via `next/image fill`
  - Play overlay (video only): `h-11 w-11 rounded-full bg-black/60 text-white`
  - Type badge (top-left): `rounded-md bg-black/65 px-2 py-1 text-[11px]` with icon
  - Bottom overlay: `bg-slate-950/80 backdrop-blur-sm px-3 py-2.5`
    - Title `line-clamp-2 text-xs font-medium leading-5`
    - Date `mt-1 text-[10px] text-white/65`

## Content

- **12 showcase tiles** — 8 videos + 4 images (matches the "视频 18 / 图片 24" counters — the tabs show total counts, only the recent 12 are rendered in "全部")
- All titles and dates are copied verbatim from the live site
- Videos are rendered as static `<Image>` posters with a play overlay (identical to the paused-video default state), because the site serves videos from TOS-signed URLs that expired and are cross-origin-locked

## Assets Downloaded (`public/`)

| Path | Origin |
|------|--------|
| `/brand/doudou-ai-mark.png` | site logo |
| `/favicon.ico`, `/seo/icon.png`, `/seo/apple-icon.png`, `/manifest.webmanifest` | favicons |
| `/images/ai/img-01…04.png` | cdn.hangfeizk.com AI-generated images |
| `/images/posters/poster-01…06.{jpg,png}` | cdn.hangfeizk.com first-frame video posters |

## Responsive Behavior

- **1440px:** sidebar 76px, header 58px, ExtractCard side-by-side panels, Showcase grid 4-col masonry
- **768px:** sidebar 76px stays visible, ExtractCard panels stack vertically, Showcase 3-col
- **390px:** sidebar becomes drawer (toggled by PanelLeft button in header), Showcase 2-col
