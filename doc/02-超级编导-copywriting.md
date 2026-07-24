# 02 超级编导（copywriting）

> 路由：`/agent/ecommerce/copywriting` · 入口：`src/app/agent/ecommerce/copywriting/page.tsx`

## 功能概述

「超级编导」是电商工作台中面向 AI 视频脚本创作的模块，页面标题旁标注「AI视频脚本」徽标。它把脚本创作拆成三个步骤（脚本生成 / 脚本改写·裂变 / 分镜与片段生成），并提供一套结构化的表单，让用户按品类、营销场景、商品卖点、优惠活动、适用场景/人群、用户痛点、参考素材、审核反馈、脚本风格与字数等维度填写创作要素，最终由「立即生成」按钮触发脚本生成，右侧面板展示「文案结果」。

当前实现为纯前端静态页面：三个步骤仅切换选中态、不改变表单内容；「立即生成」「上传识别」「发送」等按钮均未绑定实际业务逻辑；结果面板固定显示「暂无结果」占位。

## 页面结构

页面整体由两大区块组成，均由 `CopywritingPage` 单文件渲染：

1. **顶部标题卡（Header card）**
   - 左侧：标题「超级编导」+ 绿色「AI视频脚本」徽标。
   - 右侧：三步骤 Tab（`md:grid-cols-3`），每个 Tab 含图标、标题、描述与序号（`01/02/03`），点击切换 `activeStep` 选中态。
2. **主体两栏（form 380px + result 1fr，`lg:grid-cols-[380px_minmax(0,1fr)]`）**
   - **左栏 表单列**（自上而下）：
     - 品类 + 营销场景（同一卡片内两组 Pill）
     - 商品信息（单行 `input`）
     - 商品卖点（带「上传识别」的 `textarea`）
     - 优惠活动（选填，带上传识别）
     - 适用场景（选填）
     - 适用人群（选填）
     - 用户痛点（选填）
     - 参考素材 / 甲方资料（选填，带上传识别）
     - 审核反馈 / 额外要求（选填，带上传识别）
     - 脚本风格（Pill 组）+ 脚本字数（`select`）
     - 「立即生成」按钮
   - **右栏 结果面板（`aside`）**：文案结果标题 + 虚线占位框「暂无结果」，`xl:min-h-[680px]`。

## 关键文件与组件

| 文件 | 职责 |
| --- | --- |
| `src/app/agent/ecommerce/copywriting/page.tsx` | 页面主体，自包含实现：定义步骤/品类/场景/风格/字数等静态数据、内置基础组件（`SectionLabel`/`Pill`/`UploadButton`/`LabelRow`/`Field`）、管理全部表单状态并渲染两栏布局。 |
| `src/lib/utils.ts`（`cn`） | 合并 Tailwind 类名工具，页面内部各处样式拼接使用。 |
| `src/components/AgentComposer.tsx` | 通用「智能体输入框」组件，含 `textarea`、`ModeSelector`、参考图/选择主体按钮与发送按钮；按创作类型（`copy`/`rewrite`/`storyboard`）切换占位文案。**注意：当前未被本页面（及任何页面）引用**，与本模块共享「创作类型」概念，属可复用的相关组件。 |
| `src/components/ModeSelector.tsx` | 创作类型下拉选择器，数据来自 `CREATION_MODES`，含点击外部关闭逻辑；仅被 `AgentComposer` 使用，同样未在本页面出现。 |

> 说明：`copywriting/page.tsx` 并未 `import` `AgentComposer` 或 `ModeSelector`，二者是围绕相同 `CreationMode` 概念的独立/可复用组件，此处一并列出以便理解模块关系。

## 数据来源

- **页面内联静态常量**（定义于 `page.tsx` 顶部，非外部数据源）：
  - `STEPS`：三个步骤 `generate`/`rewrite`/`storyboard`（脚本生成、脚本改写·裂变、分镜与片段生成），各带图标（`FileText`/`Wand2`/`Video`）、序号与描述。
  - `CATEGORIES`：品类 `电商 / 大健康 / 工具软件 / 金融 / 教育 / 汽车`。
  - `SCENES`：营销场景 `短视频带货 / 引流直播间 / 平台电商`，每项含 `desc` 作为 `title` 悬浮提示。
  - `STYLES`：脚本风格 `不限 / 国货 / 达人种草 / 老板人设 / 家庭视角 / 网感营销`。
  - `LENGTHS`：脚本字数 `自动匹配 / 50-75字 / 75-150字 / 150-300字 / 300字以上`。
- **共享 Mock 数据**（`src/lib/mock-data.ts`，被 `AgentComposer`/`ModeSelector` 使用，非本页面直接依赖）：
  - `CREATION_MODES`：`提文案(copy)` / `文案改写(rewrite)` / `分镜片段生成(storyboard)`，各含 `label`/`desc`/`icon`，供下拉选择器渲染。
  - `EXTRACT_TABS`：`链接/视频/图片/录音/音频` 五种提文案入口（本页面未使用，供其他提文案场景复用）。
- **类型定义**（`src/types/index.ts`）：`CreationMode`、`CreationModeItem`、`ExtractTabKey`、`ExtractTab` 等，为上述数据提供 TS 约束。本页面自身的表单类型（如 `StepKey`）在 `page.tsx` 内联定义。

## 交互与状态

页面为客户端组件（`"use client"`），使用 `useState` 管理如下本地状态，无副作用、无请求：

- 选择态：`activeStep`（默认 `generate`）、`category`（默认「电商」）、`scene`（默认 `shortvideo`）、`style`（默认「不限」）、`length`（默认 `auto`）。
- 文本输入：`product`、`selling`、`promo`、`useScene`、`audience`、`painpoints`、`reference`、`feedback`（初始均为空字符串），通过受控 `input`/`textarea` 双向绑定。

行为要点：

- **步骤 Tab**：点击仅更新 `activeStep`，用于高亮当前步骤；不切换或过滤下方表单字段。
- **Pill 组**：`Pill` 组件受控高亮，`activeTone` 支持 `dark`（品类/风格用深色 `slate-950`）与 `primary`（营销场景用主题色）两种选中风格。
- **上传识别 / 立即生成 / 发送 等按钮**：均为静态 `button`，未绑定 `onClick` 业务逻辑（占位）。
- **结果面板**：恒显「暂无结果」，未随生成动作变化。
- `AgentComposer`：以 `mode` 状态驱动 `textarea` 占位文案，并用 `key={mode}` 在切换类型时重建输入框（清空内容）。
- `ModeSelector`：`open` 控制下拉展开，`useEffect` 监听 `mousedown` 实现点击外部区域自动关闭。

## 备注

- 全模块为像素级静态克隆，无接口调用、无表单校验、无生成结果持久化，所有交互仅停留在前端状态层。
- 页面样式通过顶部 `CARD`/`LABEL`/`FIELD` 常量统一控制卡片、标签与输入框外观，配合 `cn()` 拼接。
- `AgentComposer` 与 `ModeSelector` 虽在本任务范围内一并整理，但当前并未接入 `copywriting` 页面；后续若要将「对话式输入」融入超级编导，可直接复用这两个组件与 `CREATION_MODES` 数据。
