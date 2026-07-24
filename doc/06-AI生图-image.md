# 06 AI生图（image）

> 路由：`/agent/ecommerce/image` · 入口：`src/app/agent/ecommerce/image/page.tsx`

## 功能概述

「AI 生图」是电商工作台下的图片生成工作页，提供“文生图 / 图生图”两种模式的提示词输入界面，以及一份可筛选、可删除的历史记录列表。当前为纯前端交互演示：画布区域仅展示空态占位（“图片会显示在这里”），点击“生成图片”按钮不发起真实生成请求，历史记录来自页面内置的种子数据。页面顶部提示“每次进入默认是新窗口，点击历史记录才会回填旧配置”，但回填逻辑尚未在代码中实现。

## 页面结构

整体为两栏栅格布局（`grid`），大屏（`lg`）下左栏自适应、右栏固定 320px（`xl` 下 360px），高度约束为 `calc(100dvh-116px)`。

- 左栏（主工作区，纵向排列）：
  - 顶部行：标题「AI 生图」+ 副标题说明；右侧「创建新窗口」按钮（`Plus` 图标，无点击逻辑）。
  - 大画布卡片：居中空态占位，含图标、「图片会显示在这里」标题与提示文案。
  - Composer 输入区：
    - 「参考图」按钮（`Paperclip` 图标，无点击逻辑）。
    - 多行文本框 `textarea`（提示词输入，受控）。
    - 底部工具行：模式切换 `ModeToggle`（文生图/图生图）、模型选择按钮「gpt-image-2-pro」（静态展示）、比例按钮「1:1 · 自动」（静态展示）、右侧「生成图片」按钮。
- 右栏（历史记录侧边栏 `aside`）：
  - 头部：标题「历史记录」+ 当前筛选结果条数。
  - 筛选 Tab：全部 / 文生图 / 图生图（`HISTORY_TABS`）。
  - 历史卡片列表（`HistoryCard`）：可滚动；为空时展示「暂无历史记录」空态。

## 关键文件与组件

| 文件 | 职责 |
| --- | --- |
| `src/app/agent/ecommerce/image/page.tsx` | 页面全部实现，`"use client"` 客户端组件；包含默认导出 `ImageGenerationPage` 及所有子组件、类型与种子数据 |
| `src/lib/utils.ts` | 提供 `cn()` 类名合并工具，用于条件样式拼接 |
| `next/image` | 历史卡片缩略图渲染（`Image` 组件，`fill` + `object-cover`） |
| `lucide-react` | 图标：`ChevronDown`、`Image`（ImageIcon）、`Paperclip`、`Plus`、`Ratio`、`Sparkles`、`Trash2` |

页面内定义的组件与结构：

- `ImageGenerationPage`（默认导出）：页面根组件，持有全部状态。
- `ModeToggle`：文生图/图生图模式分段切换器，`props` 为 `{ mode, onChange }`。
- `HistoryCard`：单条历史记录卡片，`props` 为 `{ item, onDelete }`；含缩略图、悬停显示的删除按钮、两行截断的提示词、模式/尺寸标签与时间。

页面内类型定义：

- `GenMode = "text" | "image"`（生成模式）。
- `HistoryFilter = "all" | "text" | "image"`（历史筛选）。
- `HistoryItem`：`{ id, prompt, mode: GenMode, size, time, thumbnail? }`。

## 数据来源

全部数据为页面文件内的本地常量，**未引用** `src/lib/daai-data.ts`、`src/lib/mock-data.ts` 或 `src/types/index.ts`：

- `HISTORY_SEED: HistoryItem[]`：10 条内置历史记录种子（`h-01` ~ `h-10`），含提示词、模式、尺寸（均为「自动尺寸」）、时间与缩略图路径（`/images/ai/img-01.png` ~ `img-04.png` 循环复用）。
- `HISTORY_TABS`：历史筛选 Tab 配置（全部/文生图/图生图）。
- `MODE_TABS`：Composer 模式切换配置（文生图/图生图）。
- `MODE_LABEL: Record<GenMode, string>`：模式 key 到中文标签的映射，供历史卡片展示。

缩略图资源位于 `public/images/ai/` 目录，为静态本地图片。

## 交互与状态

组件使用 `useState` 维护 4 个状态，`useMemo` 派生 1 个：

- `mode`（默认 `"text"`）：当前生成模式，由 `ModeToggle` 切换。
- `prompt`（默认 `""`）：提示词文本，受控绑定到 `textarea`。
- `historyFilter`（默认 `"all"`）：历史筛选，由筛选 Tab 切换。
- `history`（默认 `HISTORY_SEED`）：历史记录数组，删除操作在此更新。
- `filteredHistory`（派生）：按 `historyFilter` 过滤 `history`；为 `"all"` 时返回全部，否则按 `item.mode` 匹配。

行为要点：

- `canGenerate = prompt.trim().length > 0`：提示词非空时「生成图片」按钮可用；为空时按钮禁用（`disabled`）并降低透明度、显示 `cursor-not-allowed`。
- `handleDelete(id)`：从 `history` 中过滤掉对应条目，实现单条删除；删除按钮默认隐藏，卡片悬停（`group-hover`）时显现。
- 历史头部条数展示的是 `filteredHistory.length`（当前筛选结果条数），随筛选切换而变化。

## 备注

- 页面为纯前端演示：「生成图片」「创建新窗口」「参考图」「模型选择」「比例选择」等按钮均无实际业务逻辑或后端请求；模型名「gpt-image-2-pro」、比例「1:1 · 自动」为静态展示文本。
- 副标题所述“点击历史记录才会回填旧配置”在当前代码中未实现回填逻辑；`HistoryCard` 的提示词区域虽有 `cursor-pointer` 样式，但无点击回填处理。
- 历史记录仅存于组件内存状态，删除等操作在页面刷新后重置为 `HISTORY_SEED`，无持久化。
- 该页面数据完全自包含，与其他菜单模块共用的 `daai-data.ts` / `mock-data.ts` 无耦合，修改时无需联动这些文件。
