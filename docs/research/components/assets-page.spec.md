# 我的资产 (Assets) Page Specification

Target: http://124.174.43.52/agent/ecommerce/assets (login required, admin).
Shell (`WorkspaceShell`) already provides sidebar + header + `main.bg-workspace(#f6f8fb)` +
scroll container + `div.mx-auto max-w-shell(1680px) space-y-4 pb-8`. Page renders the panel below.

## Panel wrapper
- `section.min-h-[720px] rounded-[28px] bg-[#f7f7f8] px-4 py-7 text-slate-950 sm:px-8 lg:px-14`
- inner `div.mx-auto w-full max-w-[1440px]`

## Header (`flex items-center justify-between`)
- `h1.text-2xl font-semibold tracking-tight` — "我的资产" (24px/600, slate-950)
- round button `h-9 w-9 rounded-full border border-slate-200 bg-white text-slate-500` with Cloud icon (16px) — 刷新资产
- description paragraph is `sr-only`.

## Vault tiles (`mt-14 flex flex-wrap items-start gap-8`)
Each tile `w-[150px] text-center`. Folder illustration `relative mx-auto h-[88px] w-[132px]`:
- back tab: `absolute left-4 top-0 h-9 w-[92px] rounded-[18px] border`
- front body: `absolute inset-x-0 bottom-0 flex h-[74px] items-center justify-center rounded-[18px] border shadow-sm backdrop-blur-[24px]`
  - centered icon 28px (Folder for data / Plus for new), color slate-500
  - count badge (data only): `absolute right-2 top-2 rounded-full bg-white/80 px-2 py-0.5 text-[11px] font-semibold text-slate-500`
- name `mt-2 text-sm font-semibold text-slate-950`
- origin (data only) `mt-4 text-xs text-slate-500`
Active vault = blue tint (tab bg-sky-100/border-sky-200, body from-white to-sky-50/border-sky-100). Inactive = white/60 + slate-200 border.
Tiles: 新建资产库(new) · 生成结果(active, badge 9, "图片 / 视频 / 音频") · 测试(badge 1, "本地上传") · 沪上阿姨(badge 0, "本地上传").

## Toolbar (`mt-10 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between`)
Left group `flex flex-wrap items-center gap-3`:
- segmented pill `inline-flex rounded-lg bg-slate-200/70 p-0.5`; buttons `h-9 rounded-md px-3 text-sm font-medium gap-1.5`; active `bg-white text-slate-950 shadow-sm`, inactive `text-slate-500`. Tabs: 全部(Grid2x2) 图片(Image) 视频(Video) 音频(Music).
- source select `h-10 min-w-[150px] appearance-none rounded-lg border border-slate-200 bg-white pl-4 pr-9 text-sm font-medium` + ChevronDown. Options: 全部来源/本地上传/生成结果/文案资产.
- search label `relative min-w-[220px] flex-1 xl:flex-none`; Search icon 16px slate-400 left-3; input `h-10 w-full rounded-lg border border-transparent bg-transparent pl-9` (borderless), placeholder "关键词搜索".
Right group `flex flex-wrap items-center gap-2`:
- 批量操作 `h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-950` + ListChecks.
- 降序 same but `text-slate-500` + ArrowDownUp.

## Grid (`mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5`)
First item = Add card. Then 54 asset cards.

### Add card
`button.flex aspect-square w-full flex-col items-center justify-center rounded-lg border border-slate-200 bg-white/60 shadow-sm` → Plus 36px slate-500 + `span.mt-4 text-sm font-semibold` 添加. Info row (`mt-3 flex items-start justify-between gap-3`): 添加资产 / 本地上传 + `select.h-7 max-w-[96px] rounded-md border ... text-xs text-slate-500` (类型 options) + chevron.

### Media card (image/video)
`article.group relative rounded-xl transition` → `button.block w-full text-left`:
- media `relative aspect-square overflow-hidden rounded-lg border border-slate-200 shadow-sm` (bg-black video / bg-white image); `<video src muted playsInline preload=metadata h-full w-full object-cover>` or next/image fill object-cover.
- video badge `absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-white` "视频". Images have NO badge.
- info row: `min-w-0` → title `truncate text-sm font-semibold text-slate-950`, source `mt-1 truncate text-xs text-slate-500`; date `shrink-0 text-xs text-slate-400`.
Delete btn `absolute right-3 top-3 h-9 w-9 rounded-full bg-white/95 text-slate-400 opacity-0 shadow-sm ring-1 ring-slate-200 group-hover:opacity-100 hover:text-rose-500` Trash2 16px.

### Text card
Media area `aspect-square rounded-lg border border-slate-200 bg-white/70 p-4`: icon circle `h-10 w-10 rounded-full bg-slate-100 text-slate-500` (MessageSquareQuote 20px) + `p.mt-5 line-clamp-6 whitespace-pre-line text-sm leading-6 text-slate-600`. Info row: title / 文案资产 / date "示例". Same delete btn.

## Data
`src/lib/assets-data.ts` — 54 items (42 image + 10 video + 2 text). Real titles/dates/sources and CDN URLs from /api/materials + generated videos + copy scripts.
