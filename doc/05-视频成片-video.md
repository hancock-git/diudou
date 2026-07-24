# 05 视频成片（video）

> 路由：`/agent/ecommerce/video` · 入口：`src/app/agent/ecommerce/video/page.tsx`

## 功能概述

「视频成片」是电商工作台的 AI 视频生成页面，页面顶部标题为「AI 视频」。用户在左侧的创作区（Composer）中选择素材、输入文字提示词，选择模型与视频规格（分辨率、时长、比例）后点击「立即生成视频」，即可生成投流/带货短视频；右侧为「任务队列」，以卡片形式展示历史与进行中的生成任务及其状态（已完成 / 生成中 / 失败 / 排队中），点击带成片的任务可在左侧预览区查看。

当前为纯前端静态克隆版本：所有队列数据均为写死的示例数据，各按钮（新建、选择素材、帮我写、立即生成视频等）未接入真实后端逻辑，仅提供 UI 与少量本地交互状态。

## 页面结构

采用两栏栅格布局（`grid`），队列展开时为 `左侧内容区 + 360px 队列`，收起时为单栏。

- 左侧 · 创作与预览区（`div.flex.flex-col`）
  - 标题行：标题「AI 视频」+「新建」按钮（右上角，`Plus` 图标）
  - 用量胶囊：`0 / 15`（今日额度提示）
  - 创作卡片（Composer card）
    - 顶部工具行：「选择素材」「打开资产库」「展开编辑区」三个按钮
    - 输入区：左侧 16×16 的「选择素材」占位方块 + 右侧多行文本框 `textarea`（提示词输入）
    - 计数与辅助行：字数统计 `{length} / 2000`、「优化当前 AI 视频提示词」（禁用态）、「帮我写」
    - 设置底栏：模型胶囊（`Seedance-2.0-VIP`）、视频设置胶囊（`9:16 · 720p · 15s`）、「立即生成视频」主按钮 + 「预计 300.00 积分」文案
  - 预览区卡片（Preview area）
    - 头部：「预览 · 收藏」标签 + 「预览」「收藏」按钮
    - 空状态占位：视频图标 + 文案「点击右侧队列中带成片的任务即可预览。」
- 右侧 · 任务队列（`aside`，仅当 `queueOpen` 为 true 时渲染）
  - 标题「任务队列」+「收起」按钮
  - 两个统计胶囊 `StatPill`：排队中（`queuedCount = 7`，蓝色）、生成中（`generatingCount = 0`，灰色）
  - 任务卡片列表：遍历 `QUEUE_TASKS` 渲染 `TaskCard`
- 队列收起时：右上角固定悬浮「任务队列」按钮（`Bookmark` 图标），点击可重新展开

## 关键文件与组件

| 文件 | 职责 |
| --- | --- |
| `src/app/agent/ecommerce/video/page.tsx` | 视频成片页面主体，`"use client"` 客户端组件，包含全部 UI、本地状态、示例数据及子组件 |
| `src/lib/utils.ts` | 提供 `cn()` 类名合并工具，页面内条件样式拼接依赖它 |

页面内部定义的组件与常量（均在同一文件中，未外置）：

- `VideoPage`（默认导出）：页面根组件
- `StatPill`：队列上方的统计数字胶囊，`props` 为 `{ label, value, tone }`，`tone` 支持 `"blue" | "slate"`
- `TaskCard`：单个任务卡片，`props` 为 `{ task, active, onSelect }`，渲染封面（`poster`，无封面时显示渐变占位 + 视频图标）、右上角状态角标、描述文字（`line-clamp-2`）与状态标签
- 类型：`TaskStatus = "done" | "generating" | "failed" | "queued"`；`QueueTask`（`{ id, description, status, poster }`）
- 常量：`QUEUE_TASKS`（9 条示例任务）、`STATUS_META`（各状态对应的中文标签与配色）

图标全部来自 `lucide-react`：`Bookmark`、`ChevronRight`、`Clock`、`Eye`、`FolderOpen`、`Heart`、`Loader2`、`Maximize2`、`Plus`、`Sparkles`、`Video`。

## 数据来源

本页数据完全内联在 `page.tsx` 中，未引用 `src/lib/daai-data.ts` 或 `src/lib/mock-data.ts`，也未使用 `src/types/index.ts` 中的类型。

- `QUEUE_TASKS`：写死的 9 条任务数据（`t1`–`t9`），描述为足球赛事、威化饼干、口播带货等示例文案；其中 `t6` 状态为 `failed` 且无封面（`poster: null`），其余为 `done`。
- 封面图片：引用 `public/images/posters/` 下的本地静态图（如 `poster-01.jpg`、`poster-03.png` 等），通过 `next/image` 的 `Image` 组件以 `fill` + `object-cover` 渲染。
- `STATUS_META`：将四种状态映射为中文标签（已完成 / 生成中 / 失败 / 排队中）及对应的胶囊、角标配色。
- 统计数字 `queuedCount = 7`、`generatingCount = 0` 为硬编码常量，与 `QUEUE_TASKS` 实际数量无联动。
- 模型（`Seedance-2.0-VIP`）、视频设置（`9:16 · 720p · 15s`）、额度（`0 / 15`）、积分（`300.00`）均为静态展示文案。

## 交互与状态

页面通过 `useState` 维护三个本地状态：

- `prompt`（字符串）：文本框内容，双向绑定于 `textarea`；其长度实时反映在 `{prompt.length} / 2000` 计数上。
- `queueOpen`（布尔，初值 `true`）：控制右侧任务队列的展开/收起，同时影响外层栅格列数；「收起」按钮置为 `false`，悬浮「任务队列」按钮置为 `true`。
- `activeTaskId`（`string | null`，初值 `null`）：当前选中的任务 id。点击 `TaskCard` 调用 `onSelect` 设置该 id，被选中卡片显示高亮描边与 `ring`（`border-primary/40 ring-2 ring-primary/15`）。

其余交互说明：

- `TaskCard` 根据 `task.status` 决定角标图标：`generating` 显示旋转的 `Loader2`，`queued` 显示 `Clock`，其余无图标，配色由 `STATUS_META` 决定。
- 「优化当前 AI 视频提示词」按钮为 `disabled` 禁用态（`opacity-60`）。
- 「新建」「选择素材」「打开资产库」「展开编辑区」「帮我写」「立即生成视频」「预览」「收藏」等按钮均无 `onClick` 处理逻辑，仅为静态 UI。
- 选中任务后左侧预览区并不会真正加载视频，预览区始终保持空状态占位文案。

## 备注

- 本页为 da-ai.cc 的 1:1 静态克隆，无接口调用与真实生成能力，所有业务数据与数字均为占位示例。
- 数据未抽离到 `lib/` 数据文件，若后续需要动态化或与其它页面共享，建议将 `QUEUE_TASKS`、`STATUS_META` 迁移至 `src/lib/daai-data.ts` 并补充相应类型到 `src/types/index.ts`。
- `queuedCount` / `generatingCount` 与实际任务列表脱钩，接入真实数据时需改为按 `QUEUE_TASKS` 状态动态统计。
- 封面依赖 `public/images/posters/` 下的静态资源，替换任务数据时需同步准备对应图片。
