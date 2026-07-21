# 04 爆款裂变（remix）

> 路由：`/agent/ecommerce/remix` · 入口：`src/app/agent/ecommerce/remix/page.tsx`

## 功能概述

「爆款裂变」是电商工作台中的 AI 视频裂变模块，参考 DA AI 与「即创」的批量成片体验。核心链路为：**上传爆款视频 → AI 拆解出视频结构 + 脚本文案 + 视频分解片段 → 替换元素 → 按爆款逻辑批量合成/裂变**。

页面是一个纯客户端组件（`"use client"`），当前为**静态原型/骨架实现**：所有区块内容均为占位或说明性文案，多数操作按钮处于 `disabled` 状态，实际的上传、拆解、裂变逻辑尚未接入后端，仅保留完整的界面入口与交互外壳。

页面顶部通过一组规则约束提示用户额度：最多 5 条脚本、单条脚本最多裂变 3 条视频、单次任务上限 15 条、每日 20 条免费额度、超出消耗积分。

## 页面结构

页面根节点为 `div.space-y-4`，自上而下由以下区块组成：

1. **Hero 头部区**（`section`）：左侧为 `Wand2` 图标 + 标题「爆款裂变 / AI视频裂变」+ 一句功能描述；右侧为三个胶囊按钮「资产库」「保存到资产库」「进入画布」（后者为 primary 高亮）。

2. **统计条（Stats strip）**：2 列（移动端）/ 4 列（`lg`）网格，渲染 `STAT_PILLS` 四张卡片——素材内容（0/5）、脚本数量（1/5）、本次裂变（3/3）、今日免费（20/20），每张含彩色图标、计数、标签与提示文案。

3. **信息卡（Info card）**：标题「爆款裂变主链路」（`FlaskConical` 图标）+ 链路文字说明；右侧渲染 `CHIPS` 五个规则标签胶囊。下方为 **时间线（Timeline）**，用 1/2/4 列网格渲染 `TIMELINE_STEPS` 四个步骤卡片（上传参考视频 / AI拆解爆款结构 / 替换元素并同步画布 / 批量生成裂变视频），每卡含步骤序号圆标、图标、标题与描述。

4. **区块 1「添加素材内容」**（`SectionCard`）：右上角显示 `0/5` 计数徽标；主体为虚线边框的拖拽上传占位区（`Upload` 图标 + 提示支持 MP4/MOV/JPG/PNG，单次最多 5 条、单文件 ≤ 200MB）。

5. **区块 2「脚本文案」**（`SectionCard`）：右上角为「添加脚本」按钮。内部含：
   - 脚本标签栏：当前仅一个「脚本 1」标签（根据 `scriptTab` 高亮）。
   - 子标签组：渲染 `SCRIPT_SUB_TABS`——「手动输入」「AI帮写」（可用）、「脚本库」（禁用）。
   - 文案输入框：`textarea`，绑定 `scriptContent`，右下角显示 `字数/1000` 计数。

6. **区块 3「AI拆解：视频结构 + 脚本文案 + 视频分解片段」**（`SectionCard`）：右上角为「自动拆分」「进入画布」两个 **disabled** 按钮；主体为 `Scissors` 图标的空状态占位说明。

7. **区块 4「替换素材 / 文案后裂变」**（`SectionCard`）：右上角为裂变条数下拉（`SelectPill`，1 条 / 3 条）+「开始裂变」**disabled** primary 按钮；主体为 `Blocks` 图标的空状态占位。

8. **区块「更多配置」**（`SectionCard`）：含「商免素材 / 默认商用免费」徽标；下方 3 列网格渲染三个 `ConfigSelect` 下拉——配音（`voice`）、音乐（`music`）、花字（`textStyle`）；再下方为「字幕/水印蒙版」开关按钮（整块可点，含 toggle 样式）。

9. **区块「裂变视频」**（`SectionCard`）：右上角为「下载」「删除」两个 **disabled** 按钮；主体为 `Film` 图标的「暂无裂变视频」空状态。

10. **区块「画布同步与关联」**（`SectionCard`）：右上角为「进入画布」primary 按钮；主体 3 列网格渲染 `CANVAS_SYNC_CARDS` 三张彩色底色卡片（视频结构 / 脚本文案 / 视频分解片段）。

11. **区块「任务与计费规则」**（`SectionCard`）：纯文字说明脚本、视频数量上限与免费额度规则，底部含「可用积分：无限」的提示条（`Boxes` 图标）。

## 关键文件与组件

| 文件 | 职责 |
| --- | --- |
| `src/app/agent/ecommerce/remix/page.tsx` | 页面主体，默认导出 `RemixPage`；内含全部区块布局、状态、常量数据及本地子组件 |
| `src/types/index.ts` | 提供 `LucideIcon` 类型（`ComponentType<SVGProps<SVGSVGElement>>`），用于常量数组与子组件的图标属性标注 |
| `src/lib/utils.ts` | 提供 `cn()` 类名合并工具，贯穿所有条件样式拼接 |
| `lucide-react` | 图标库，页面引入 20+ 图标（`Wand2`、`Upload`、`Scissors`、`Blocks`、`Film`、`Sparkles` 等） |

页面内定义的**本地子组件**（均在同文件底部）：

| 组件 | 职责 |
| --- | --- |
| `SectionCard` | 通用卡片容器，接收 `title`/`subtitle`/`right`/`children`，统一区块头部布局 |
| `PillButton` | 胶囊按钮，支持 `variant`（default/primary）、`size`（md/sm）、`disabled`、`onClick`、图标 |
| `SelectPill` | 胶囊样式下拉框（用于裂变条数选择），带 `ChevronDown` 图标 |
| `ConfigSelect` | 带标题图标的方形下拉框（用于配音/音乐/花字配置） |

## 数据来源

**本页不引用 `src/lib/daai-data.ts` 或 `src/lib/mock-data.ts`**，全部展示数据均为 `page.tsx` 内定义的模块级常量：

- `STAT_PILLS`：统计条四项卡片数据（key、count、label、hint、icon、图标底色/文字色）。
- `CHIPS`：信息卡右侧五个规则标签文案数组。
- `TIMELINE_STEPS`：时间线四步骤（step、title、description、icon）。
- `SCRIPT_SUB_TABS`：脚本子标签配置（`as const`），含 `manual`/`ai`（enabled）与 `library`（disabled）；并由其派生类型 `ScriptSubTab`。
- `CANVAS_SYNC_CARDS`：画布同步三张卡片（含标题、描述、图标及各自的底色/边框/图标配色）。

下拉选项（配音/音乐/花字/裂变条数）以内联字面量数组的形式直接写在 JSX 中，未抽成常量。

## 交互与状态

组件内共声明 7 个 `useState`：

| 状态 | 初始值 | 用途 | 更新入口 |
| --- | --- | --- | --- |
| `scriptTab` | `"script-1"` | 当前脚本标签；决定「脚本 1」按钮高亮 | **只读**——解构时未取 setter，无切换逻辑（当前仅一个标签） |
| `scriptSubTab` | `"manual"` | 脚本子标签（手动输入/AI帮写/脚本库） | 子标签按钮 `onClick`，仅在 `enabled` 时调用 `setScriptSubTab` |
| `scriptContent` | `""` | 脚本文案输入内容 | `textarea` 的 `onChange`，写入时按 `slice(0, 1000)` 截断至 1000 字 |
| `voice` | `"auto"` | 配音配置 | 「配音」`ConfigSelect` 的 `onChange` |
| `music` | `"auto"` | 音乐配置 | 「音乐」`ConfigSelect` 的 `onChange` |
| `textStyle` | `"hype"` | 花字配置 | 「花字」`ConfigSelect` 的 `onChange` |
| `maskOn` | `true` | 字幕/水印蒙版开关 | 蒙版按钮 `onClick`，以 `setMaskOn((v) => !v)` 取反 |
| `batchCount` | `"3"` | 裂变条数（1/3） | 区块 4 的 `SelectPill` `onChange` |

**标签/步骤切换与事件：**

- **脚本主标签**：仅「脚本 1」一个按钮，样式随 `scriptTab === "script-1"` 高亮；按钮无 `onClick`，实际不可切换。
- **脚本子标签**：三选一切换；「脚本库」`enabled: false`，按钮 `disabled` 且样式置灰（`cursor-not-allowed opacity-50`），点击被 `t.enabled &&` 守卫拦截。
- **文案输入**：受控输入 + 1000 字上限截断，实时展示字数统计。
- **配音/音乐/花字**：三个受控下拉，分别更新对应状态。
- **裂变条数**：`SelectPill` 受控下拉，更新 `batchCount`（选项为「裂变 1 条」「裂变 3 条」）。
- **字幕/水印蒙版**：整块按钮点击切换 `maskOn`，开启时显示「已开启」徽标、图标与 toggle 圆点位移及背景色随状态变化。

**禁用（无实际行为）的按钮**：区块 3 的「自动拆分」「进入画布」、区块 4 的「开始裂变」、区块「裂变视频」的「下载」「删除」均为 `disabled`。Hero 与「画布同步」区的「资产库」「保存到资产库」「进入画布」等 `PillButton` 未传 `onClick`，点击无副作用（占位入口）。

## 备注

- 该页为**纯前端静态原型**：上传、AI 拆解、裂变生成、下载等核心能力尚未接入后端，界面以空状态占位 + 禁用按钮呈现完整流程骨架。
- `scriptTab` 虽用 `useState` 声明，但未取 setter，属于「预留多脚本标签」的伏笔；当前恒为单个「脚本 1」。
- 计费文案强调「可用积分：无限」，表明真实 token 消耗（AI 生视频、克隆音色等）接入后才计费，未成功任务不扣费。
- 所有条件样式均通过 `cn()` 合并 Tailwind 类名，未使用内联 style，符合项目代码规范。
