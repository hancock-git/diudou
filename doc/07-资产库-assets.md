# 07 资产库（assets）

> 路由：`/agent/ecommerce/assets` · 入口：`src/app/agent/ecommerce/assets/page.tsx`

## 功能概述

「资产库」（页面标题「我的资产」）是电商工作台中集中管理各类素材的模块，对 da-ai.cc「我的资产」页做 1:1 克隆。页面把用户的图片、视频、音频、文案资产统一沉淀为可浏览、可筛选、可检索的网格化素材库，并以「资产库（Vault）」文件夹形式对素材做分组归类。

核心能力：

- 顶部以文件夹形式展示多个「资产库」分组（含「新建资产库」入口），可点击切换当前激活分组。
- 工具栏支持按素材类型（全部 / 图片 / 视频 / 音频）分段切换、按来源下拉筛选、关键词搜索、以及升/降序排序。
- 素材以正方形卡片网格展示，图片用 `next/image` 渲染、视频用 `<video>` 元素渲染并带「视频」角标、文案资产以引用卡形式展示文案正文。
- 每张卡片悬停时右上角出现删除按钮，可从当前列表移除该素材（前端本地状态删除）。

组件为客户端组件（文件首行 `"use client"`），全部交互与筛选逻辑在浏览器端完成，数据为内置静态 mock，无后端请求。

## 页面结构

整体为一个圆角面板 `section`（`min-h-[720px] rounded-[28px] bg-[#f7f7f8]`），内部限宽 `max-w-[1440px]`，自上而下分为四块：

1. **页头（Header）**：左侧标题「我的资产」（`h1`，24px/600），右侧一个圆形「刷新资产」按钮（Cloud 图标，`aria-label="刷新资产"`，当前无点击逻辑）。下方有一段 `sr-only` 的无障碍描述文本（说明分类与每个素材支持的属性）。
2. **资产库文件夹区（Vault tiles）**：`flex flex-wrap gap-8`，首个为「新建资产库」磁贴（`NewVaultTile`），其后渲染 `VAULTS` 数组中的每个资产库磁贴（`VaultTile`），每个磁贴含文件夹插画、右上角数量角标、名称与来源说明。激活项呈蓝色高亮（仅 `tone: "blue"` 的项显示蓝色，其余激活时为白/灰高亮）。
3. **工具栏（Toolbar）**：`xl` 断点下左右分栏。
   - 左组：类型分段控件（全部 / 图片 / 视频 / 音频）+ 来源下拉 `select`（全部来源 / 本地上传 / 生成结果 / 文案资产）+ 关键词搜索输入框。
   - 右组：「批量操作」按钮（ListChecks 图标，当前无逻辑）+ 排序切换按钮（在「降序 / 升序」间切换）。
4. **素材网格（Grid）**：响应式网格（`sm:2 / lg:3 / 2xl:5` 列），首个为「添加资产」卡（`AddCard`），其后渲染筛选后的素材卡片（`AssetCard`）。

## 关键文件与组件

| 文件 | 职责 |
| --- | --- |
| `src/app/agent/ecommerce/assets/page.tsx` | 资产库页面主组件，包含全部 UI、筛选/排序/删除状态逻辑及所有子组件定义 |
| `src/lib/assets-data.ts` | 资产数据源，导出 `AssetKind`、`AssetItem` 类型与 `ASSET_ITEMS` 数组（54 条真实素材） |
| `src/lib/utils.ts` | `cn()` 类名合并工具 |

`page.tsx` 内定义的子组件与常量：

| 名称 | 类型 | 职责 |
| --- | --- | --- |
| `AssetsPage` | 默认导出组件 | 页面根组件，持有全部状态并组装子组件 |
| `NewVaultTile` | 组件 | 「新建资产库」磁贴（纯展示，无点击逻辑） |
| `VaultTile` | 组件 | 单个资产库文件夹磁贴，接收 `vault` / `active` / `onSelect` |
| `AddCard` | 组件 | 「添加资产」卡，含资产类型下拉（`ASSET_TYPE_OPTIONS`，纯展示） |
| `AssetCard` | 组件 | 单张素材卡，按 `item.kind` 分别渲染文案卡 / 视频卡 / 图片卡 |
| `DeleteButton` | 组件 | 卡片右上角悬停显隐的删除按钮 |
| `InfoRow` | 组件 | 卡片信息行（标题 / 来源 / 日期） |
| `VAULTS` | 常量 | 资产库分组数据（生成结果 / 测试 / 沪上阿姨） |
| `TYPE_TABS` | 常量 | 类型分段控件配置（全部 / 图片 / 视频 / 音频 + 对应 Lucide 图标） |
| `SOURCE_OPTIONS` | 常量 | 来源下拉选项 |
| `ASSET_TYPE_OPTIONS` | 常量 | 添加卡的资产类型下拉选项（商品素材 / 场景素材 / …） |
| `SOURCE_MATCH` | 常量 | 来源筛选 key 到数据 `source` 字段值的映射 |

页面本地定义的类型：`FilterKind`（`"all" | "image" | "video" | "audio"`）、`SourceFilter`（`"all" | "local" | "generated" | "copy"`）、`SortDir`（`"desc" | "asc"`）、`Vault` 接口。

## 数据来源

素材数据全部来自 `src/lib/assets-data.ts` 的 `ASSET_ITEMS` 静态数组，共 **54 条**（42 张图片 + 10 个视频 + 2 条文案），为对目标站 `/api/materials`、生成视频（volcengine）与文案脚本的 1:1 镜像，含真实标题、来源、日期与 CDN 媒体 URL。

`AssetItem` 类型定义：

- `id: string` — 唯一标识（`a-01` ~ `a-54`）
- `kind: AssetKind` — `"image" | "video" | "audio" | "text"`
- `title: string` — 标题（多为生成该素材的提示词）
- `source: string` — 来源，取值有「本地上传」「AI生成」「文案资产」
- `date: string` — 日期文本（如 `07/16 12:26`，文案资产为「示例」）
- `url?: string` — 图片 / 视频的 CDN 地址
- `quote?: string` — 文案资产的正文内容

数组已按「时间降序（最新在前）」预排序，页面默认即为「降序」。

资产库文件夹分组数据（`VAULTS`）与添加卡的类型选项（`ASSET_TYPE_OPTIONS`）为 `page.tsx` 内的硬编码常量，与 `ASSET_ITEMS` 相互独立——即文件夹上的数量角标（生成结果 9、测试 1、沪上阿姨 0）是写死的展示值，并不由真实素材数量或当前筛选结果动态计算，切换文件夹也不会过滤网格素材。

注意：数据中虽定义了 `"audio"` 类型，但 `ASSET_ITEMS` 实际不含音频条目；「音频」分段可选，但筛选结果为空。

## 交互与状态

`AssetsPage` 通过 `useState` 维护以下状态：

- `activeVault`（默认 `"v-1"`）— 当前激活的资产库，仅影响磁贴高亮样式，不参与素材过滤。
- `typeFilter`（默认 `"all"`）— 类型分段筛选，匹配 `item.kind`。
- `sourceFilter`（默认 `"all"`）— 来源下拉筛选，通过 `SOURCE_MATCH` 将 key 映射为 `item.source` 值后匹配。
- `search`（默认 `""`）— 关键词，对 `item.title` 做小写包含匹配（去首尾空格）。
- `sortDir`（默认 `"desc"`）— 排序方向，点击排序按钮在 `desc/asc` 间切换。
- `items`（初始为 `ASSET_ITEMS`）— 当前素材列表，删除操作作用于此。

筛选与排序在 `visible = useMemo(...)` 中计算：先按类型、来源、关键词依次过滤 `items`；因源数据已是最新在前，`desc` 直接返回过滤结果，`asc` 返回其反转副本（`[...filtered].reverse()`）。

删除逻辑：`handleDelete(id)` 通过 `setItems` 过滤掉对应 `id`，仅修改前端本地状态，不做持久化；卡片悬停时 `DeleteButton` 由 `opacity-0` 过渡为可见。

`AssetCard` 按 `item.kind` 分支渲染：

- `text` — 引用样式卡片，展示 `MessageSquareQuote` 图标与 `item.quote`（`whitespace-pre-line` 保留换行，`line-clamp-6` 截断）。
- `video` — 黑底 `<video muted playsInline preload="metadata">`，左上角带「视频」角标。
- `image`（及其它有 `url` 者）— `next/image` 以 `fill` + `object-cover` 渲染；无 `url` 时不渲染媒体。

其余为纯展示、当前无实际逻辑的交互点：页头「刷新资产」按钮、「新建资产库」磁贴、「批量操作」按钮、「添加资产」卡及其类型下拉。

## library 页面说明

> 路由：`/agent/ecommerce/library` · 入口：`src/app/agent/ecommerce/library/page.tsx`

`library/page.tsx` 是一个独立页面「**文案/分镜库**」，与 assets（我的资产）是**两个不同的模块**，二者定位与实现均不同：

| 维度 | assets（我的资产） | library（文案/分镜库） |
| --- | --- | --- |
| 页面标题 | 我的资产 | 文案/分镜库 |
| 管理对象 | 图片 / 视频 / 音频 / 文案等多类媒体素材 | 文案与分镜脚本（改写、拆分镜历史） |
| 展示形态 | 素材卡片网格 + 资产库文件夹 | 顶部统计卡 + 历史记录**表格**（列表模式） |
| 数据来源 | `src/lib/assets-data.ts`（`ASSET_ITEMS`，54 条） | 页面内硬编码 `ENTRIES`（2 条示例）+ `STATS` 统计卡 |
| 主要交互 | 类型/来源/关键词筛选、排序、删除 | 分类筛选（全部 / 历史收藏）、类型筛选（全部 / 仅文案 / 含分镜）、搜索、复制、删除 |
| 关联跳转 | 无 | 头部「写新文案」及每行「进入工作台」均 `Link` 跳转至 `/agent/ecommerce/copywriting`（文案改写模块） |

`library` 页由 `LibraryPage` 组件构成，含 `LibraryEntry`、`CategoryFilter`、`TypeFilter`、`StatCard` 等本地类型；筛选逻辑同样用 `useMemo` 在前端完成；「复制」按钮调用 `navigator.clipboard.writeText(entry.title)` 并短暂显示「已复制」；搜索表单 `onSubmit` 仅 `preventDefault`（实时输入即过滤）；删除按钮当前无逻辑。

**二者关系**：library 面向「文案/分镜」这类文本创作产物并强绑定文案工作台（copywriting），是文案链路的历史沉淀入口；assets 面向多媒体素材的统一资产管理。两个页面数据源、UI 结构与交互均相互独立，代码上没有直接依赖。assets 数据中虽有 2 条 `kind: "text"` 的「文案资产」（`a-53`、`a-54`），其正文与 library 的两条 `ENTRIES` 示例内容相同，但分属两套独立的静态数据、并无引用关系。

## 备注

- 全部数据均为静态 mock，页面无任何后端接口调用；删除、切换文件夹、排序等操作只影响前端状态，刷新页面即恢复初始。
- 资产库文件夹角标数量为硬编码常量，不随真实素材数或筛选结果变化。
- `AssetKind` 定义了 `"audio"`，但当前数据无音频条目，「音频」分段筛选结果为空。
- 页头刷新按钮、新建资产库、批量操作、添加资产及其类型下拉均为占位交互，尚未实现具体逻辑。
- 背景规格文档见 `docs/research/components/assets-page.spec.md`，记录了对目标站的像素级还原细节（样式类名、尺寸等）。
