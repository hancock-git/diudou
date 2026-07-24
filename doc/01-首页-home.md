# 01 首页（home）

> 路由：`/agent/ecommerce/home` · 入口：`src/app/agent/ecommerce/home/page.tsx`

## 功能概述

首页是「丢抖AI 电商工作台」进入电商 Agent 后的默认落地页，采用「文案提取 → 成品展示」的自上而下动线，承担两个核心场景：

1. **文案提取**：`HomeComposer` 支持从链接、视频、图片、录音、音频五类素材中提取口播文案，带进度模拟、用时提示、结果操作与「快速成片」下拉入口。
2. **成品展示**：`DiscoverFeed` 按 da-ai.cc 发现流布局，以瀑布流集中展示 AI 视频成片与图片成品，支持「全部/视频/图片」分段切换与「查看全部」入口。

页面入口 `HomePage` 是一个纯组合式的服务端组件，本身不含任何逻辑，仅依次渲染 `HomeComposer`（外层包一个居中列容器）、`DiscoverFeed` 与 `Footer`。外层侧边栏与整体框架由统一后的 `WorkspaceShell`（所在路由段 `layout.tsx`）提供。

## 页面结构

### HomeComposer（文案提取）
`src/components/daai/HomeComposer.tsx`，客户端组件。顶部为标题「丢抖AI电商，为电商而生的 AIGC 平台」及蓝色径向光晕背景，下方为白底毛玻璃圆角卡片「文案提取」，分为：

- **头部**：`Sparkles` 图标 + 「文案提取」标题，右侧为 5 个胶囊 Tab（链接/视频/图片/录音/音频提文案），选中项高亮为主题蓝 `#0471FE`。
- **左侧输入面板**：标题为当前 Tab 的 `label`，右上角「提取文案」按钮。输入区随 Tab 类型变化：
  - `kind: "text"`（链接）→ 渲染 `textarea`，含对应占位文案。
  - `kind: "file"`（视频/图片/录音/音频）→ 渲染上传区，支持点击或拖拽上传，选中后显示文件名、「重新选择」「移除」，并展示各类型的格式说明（`formats`）。
  - 提取进行中 → 输入区替换为「提取中」loading 占位 + 当前 Tab 的 `hint` 提示。
- **右侧结果面板**：标题「提取结果（xx）」。右上角操作区依次为：完成后出现的「本次提取仅用时 N 秒」用时徽标、`保存到资产库`、`脚本改写/裂变`、`复制`、`快速成片`下拉按钮。完成后面板上方出现绿色成功横幅「1 个提取任务已完成，快来查看吧！」，下方结果区显示提取到的 mock 文案（未提取时为占位提示）。
- **快速成片下拉**：点击展开菜单，含 4 项：`数字人成片`（disabled）、`分镜与片段生成`、`智能成片`、`高级画布`；点击任一项仅关闭菜单。
- **进度卡**：提取过程中在结果面板下方显示独立进度卡，含「(类型)处理中，正在努力提取可用文案」、百分比、进度条与「已等待 N 秒」。

### DiscoverFeed（成品展示）
`src/components/daai/DiscoverFeed.tsx`，客户端组件，按 da-ai.cc 发现流布局还原。

- **头部**：左侧为标题「成品展示」+ 副标题「视频成片优先展示，图片成品随后呈现。」；右侧为分段式 Tab 与「查看全部」按钮。
- **分段式 Tab**：来自 `DISCOVER_TABS`，为「全部 / 视频 / 图片」三项，包裹在浅灰底的分段控件内，选中项为白底带阴影；视频、图片 Tab 右侧显示对应数量角标（由 `DISCOVER_ITEMS` 实时统计）。
- **查看全部**：`FolderOpen` 图标 + 文案的纯 UI 按钮，未绑定跳转。
- **瀑布流**：使用 CSS 多列（`columns-2` → `sm:columns-3` → `lg:columns-4` → `xl:columns-5`）实现响应式 masonry。每个 `article` 为一张封面卡：
  - 封面图按 `item.aspect` 设置宽高比，`object-cover`，hover 轻微放大。
  - 底部叠加自下而上的黑色渐变遮罩。
  - 覆盖信息条：左侧为类型图标（视频 `Film` / 图片 `ImageIcon`）+ 截断标题，右下角为爱心 `Heart` 图标 + 点赞数 `likes`，均带投影提升可读性。

### Footer（页脚）
`src/components/daai/Footer.tsx`，服务端组件。居中显示版权「Copyright © 丢抖AI」、网站备案号链接「浙ICP备2024085888号-4」（跳转工信部备案系统）与「联系我们」按钮，以 `|` 分隔。

## 关键文件与组件

| 文件 | 职责 |
| --- | --- |
| `src/app/agent/ecommerce/home/page.tsx` | 首页入口，服务端组件，组合渲染 `HomeComposer` + `DiscoverFeed` + `Footer`。 |
| `src/components/daai/HomeComposer.tsx` | 文案提取模块；含多 Tab 切换、文件/文本输入、提取进度模拟、结果操作、快速成片下拉；内含子组件 `ResultAction`（结果操作按钮）。`TABS`、`MOCK_RESULT`、`QUICK_ACTIONS` 三张常量表定义在文件内部。 |
| `src/components/daai/DiscoverFeed.tsx` | 成品展示；含分段 Tab 过滤与 CSS 瀑布流，卡片为 da-ai.cc 覆盖式布局（类型图标 + 标题 + 爱心点赞）。 |
| `src/components/daai/Footer.tsx` | 页脚版权/备案/联系信息。 |
| `src/lib/daai-data.ts` | 提供 `DISCOVER_TABS`、`DISCOVER_ITEMS`、`DiscoverItem`、`DiscoverTabKey` 等静态 mock 数据与类型。 |
| `src/lib/utils.ts` | 提供 `cn()` 类名合并工具。 |

## 数据来源

均为静态 mock，无接口请求。

- **`HomeComposer` 内部常量（定义在组件文件内，未抽到 daai-data）**：
  - `TABS`：5 个 Tab 配置，每项含 `key`（`link`/`video`/`image`/`voice`/`audio`）、`label`、`short`（短名，用于结果标题与上传文案）、`icon`（Lucide）、`kind`（`text`/`file`）、`placeholder`、`hint`、`accept`（文件类型）、`formats`（格式说明）。
  - `MOCK_RESULT`：按 Tab `key` 映射的提取结果 mock 文案（Markdown 风格文本）。
  - `QUICK_ACTIONS`：快速成片下拉 4 项，含 `key`、`label`、`icon`、`disabled`（仅「数字人成片」为 `true`）。
- **`src/lib/daai-data.ts`**：
  - `DISCOVER_TABS`：`all`/`video`/`image` 三个 Tab，含 `label`；`DiscoverTabKey` 由其推导。
  - `DiscoverItem` 接口：`id`、`kind`（`video`/`image`）、`title`、`author`、`date`、`likes`（点赞数，卡片右下角展示）、`aspect`（宽高比）、`src`。
  - `DISCOVER_ITEMS: DiscoverItem[]`：由 `Array.from({ length: 20 })` 程序化生成的 20 条作品。`kind` 按 `i % 3 === 1` 判定为 `image`、其余为 `video`；`title`/`author`/`aspect` 按索引取模自 `DISCOVER_TITLES`/`DISCOVER_AUTHORS`/`DISCOVER_ASPECTS`；`likes` 由索引经取模公式生成（约 8~493）；`date` 由索引推算；`src` 指向 `/images/discover/card-NN.(png|jpg)`（第 11 张为 `jpg`，其余 `png`）。
  - 注：`daai-data.ts` 中还保留了 `HERO_BANNERS`、`QUICK_ENTRY_FEATURED`、`QUICK_ENTRY_CARDS` 等常量，但当前首页均未使用。

## 交互与状态

### HomeComposer
使用如下 `useState`：`tab`（当前 Tab，默认 `"link"`）、`value`（文本输入）、`fileName`（已选文件名）、`result`（提取结果文本）、`copied`（复制反馈）、`extracting`（提取中）、`progress`（进度百分比）、`elapsed`（已等待秒数）、`doneSeconds`（完成用时）、`quickOpen`（下拉开关）、`dragging`（拖拽高亮）；另有 `timerRef`（定时器）、`quickRef`（下拉外点检测）、`fileInputRef`（隐藏文件输入）三个 ref。

- **Tab 切换（`switchTab`）**：清除定时器、切换 `tab` 并 `resetState()` 重置全部输入/结果/进度状态。
- **是否可提取（`canExtract`）**：文件类 Tab 需有 `fileName`，文本类 Tab 需 `value` 去空后非空；否则「提取文案」按钮禁用。
- **提取流程（`handleExtract`，纯前端模拟）**：置 `extracting=true`，用 `setInterval`（220ms）每次将进度 `+7` 直至 100%；进度到达 100% 时停止定时器、`extracting=false`、写入 `MOCK_RESULT[tab]` 作为结果，并按真实经过时间设 `doneSeconds`（至少 1 秒）。过程中同步刷新 `progress` 与 `elapsed`。
- **文件选择（`pickFile`）**：点击或拖拽触发隐藏 `input[type=file]`，取首个文件名写入 `fileName`；支持「重新选择」「移除」。
- **复制（`handleCopy`）**：调用 `navigator.clipboard.writeText(result)`，成功后 `copied=true` 并在 1.6 秒后复位；`clipboard` 失败时静默忽略。
- **快速成片下拉**：`quickOpen` 控制展开；通过 `useEffect` 监听 `mousedown` 实现点击外部自动关闭；菜单项点击仅 `setQuickOpen(false)`，无实际跳转。
- **`保存到资产库`、`脚本改写/裂变`**：由子组件 `ResultAction` 渲染，为纯 UI 按钮，未绑定业务逻辑。
- **清理**：`useEffect(() => stopTimer, [])` 在卸载时清除定时器。

### DiscoverFeed
- `const [tab, setTab] = useState<DiscoverTabKey>("all")`，默认「全部」。
- `items`：用 `useMemo` 按 `tab` 过滤 `DISCOVER_ITEMS`（`all` 全部，否则 `it.kind === tab`）。
- `counts`：用 `useMemo` 统计 video/image 数量，用于分段 Tab 数量角标。
- 点击分段 Tab 切换 `tab` 并联动过滤与高亮；「查看全部」按钮与作品卡片均为纯展示，无点击业务逻辑。

## 备注

- 对应 da-ai.cc「丢抖AI 电商工作台」首页，属 1:1 像素级克隆。
- 本页曾在「统一左侧菜单」改造时被简化，现已恢复为完整版并按 da-ai.cc 重新调整：当前仅由 `HomeComposer` + `DiscoverFeed` + `Footer` 三块组成，外层沿用统一后的 `WorkspaceShell` 侧边栏。
- **`QuickEntry` 快捷入口区已整块删除**，不再出现在首页；旧的简化版组件 `ExtractCard` / `ShowcaseCard` 亦已删除。
- `DiscoverFeed` 已由早期「创作广场」布局改为 da-ai.cc 发现流布局：新增「成品展示」标题与副标题、分段式 Tab、「查看全部」按钮，卡片改为封面 + 底部渐变遮罩 + 覆盖信息条（类型图标 + 标题 + 爱心点赞数 `likes`）。
- 页面数据均为静态 mock（组件内常量 + `src/lib/daai-data.ts`），无接口请求、无持久化。
- 交互多为 UI 层占位：Tab 切换/过滤、文件选择、复制、进度模拟真实可用，但「提取文案」的结果为固定 mock 文本；「保存到资产库」「脚本改写/裂变」「快速成片」各菜单项、「查看全部」与作品卡片点击等均未绑定实际业务逻辑。
- 图片资源依赖 `public/images/discover/` 本地静态目录。
