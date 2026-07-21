# 03 高级画布（canvas）

> 路由：`/agent/ecommerce/canvas`（落地）、`/agent/ecommerce/canvas/[id]`（全屏编辑器） · 入口：`src/app/agent/ecommerce/canvas/`

## 功能概述

「高级画布」是「丢抖AI 电商工作台」中最复杂的模块，对标 da-ai.cc/canvas，属 1:1 像素级克隆。它由两层页面组成：

- **落地页（`/agent/ecommerce/canvas`）**：以「新手教程 + 我的创作」两个板块承载画布项目的浏览与管理入口，仍处于工作台侧边栏外壳（`WorkspaceShell`）之内，与其余菜单共享同一导航。
- **全屏编辑器（`/agent/ecommerce/canvas/[id]`）**：一个占满整个视口（`h-dvh`）的无限画布编辑器，基于 `@xyflow/react`（React Flow）实现节点式创作工作流。用户可在画布上添加文本 / 图片 / 视频 / 音频四类「节点」，通过连线组织生成逻辑，并借助浮层顶栏、左侧工具栏、底部控制条、右键菜单、选中检视面板、模板面板、对话抽屉等一整套悬浮 UI 完成编辑。该编辑器自带完整 chrome，会跳过工作台外壳全屏铺满。

整个模块为纯前端 mock，无任何后端接口、无持久化：节点内容、缩放、连线等状态全部保存在编辑器组件的内存中，刷新即丢失；积分、发送、生成、保存、模板、历史、对话等业务动作大多为占位 UI（no-op）。

## 页面结构

### 落地页（`CanvasLanding`）

页面入口 `src/app/agent/ecommerce/canvas/page.tsx` 仅渲染 `<CanvasLanding />`，落地页整体分两个 `section`：

- **新手教程**：标题「新手教程」旁带一个可折叠按钮（`ChevronDownIcon`，展开时图标旋转 180°）。展开状态下渲染 4 张教程卡片（`CANVAS_TUTORIALS`），响应式网格（`sm:2 列 / xl:4 列`），每张为 2:1 比例的封面图，hover 时上移、放大并在中央淡入播放按钮（`PlayBadge`）。
- **我的创作**：标题「我的创作」下方为 `auto-fill` 自适应网格（列宽 `minmax(190px,1fr)`）。
  - **开始创作卡**：虚线边框方形卡，内含「＋」图标，链接指向 `/agent/ecommerce/canvas/new`（即以 `id="new"` 打开一个空白编辑器）。
  - **项目卡列表**：遍历 `CANVAS_PROJECTS` 渲染，每张为方形灰底卡片，`preview` 存在则显示预览图，否则显示「无预览」占位文字；卡片链接指向 `/agent/ecommerce/canvas/{id}`。hover 时右上角淡入 4 个操作按钮（`ProjectActions`：修改名称 / 复制项目 / 分享到发现 / 删除项目，删除按钮 hover 变红）。卡下方显示项目名（`p.name`，可截断）与更新时间（`p.updatedAt`）。

### 编辑器（`CanvasEditor`）

编辑器路由 `src/app/agent/ecommerce/canvas/[id]/page.tsx` 是一个 `async` 服务端组件：`await params` 取出 `id`，在 `CANVAS_PROJECTS` 中按 `id` 查找项目，把 `project?.name ?? "未命名画布"` 作为 `projectName` 传给 `<CanvasEditor />`（找不到项目——如 `id="new"`——即回退为「未命名画布」）。

`CanvasEditor` 外层用 `<ReactFlowProvider>` 包裹内部 `EditorInner`，后者是承载全部编辑逻辑的客户端组件。可见结构（均为绝对定位悬浮层，叠在全屏 React Flow 画布之上）：

#### 画布主体（React Flow）

- 铺满 `flex-1` 容器的 `<ReactFlow>`，点状背景（`Background variant=Dots`，`gap=18` `size=1.4`）。
- 缩放范围 `minZoom=0.2` ~ `maxZoom=2.5`；`panOnDrag` 平移、`zoomOnScroll` 滚轮缩放、关闭双击缩放。
- `connectionMode=Loose`、`connectOnClick=false`，删除键为 `Backspace` / `Delete`，隐藏 React Flow 官方水印。
- 画布为空（`nodes.length === 0`）时，中央显示提示药丸「双击画布添加新卡片」。
- 小地图（`<MiniMap>`）默认关闭，由底部控制条切换；开启后定位在左下角（`!bottom-16 !left-4`），可平移可缩放。

#### 顶栏 `Topbar`（悬浮，`z-[1400]`）

`pointer-events-none` 的顶部条，左右两组胶囊本身 `pointer-events-auto`：

- **左侧组**：da-ai logo + 下拉箭头按钮，点击展开项目菜单（返回画布列表 / 复制项目 / 导出画布 / 删除项目，「返回画布列表」为指向 `/agent/ecommerce/canvas` 的 `Link`，其余为占位按钮，删除项红色）；菜单点击外部区域自动关闭。分隔线后是画布名称输入框（`name`，占位「未命名画布」）。
- **右侧组**：可用积分（`✦` + `credits`，为链接指向 `/account`）、「分享」按钮（`ShareIcon`）、「对话」按钮（`ChatIcon`，`data-active` 高亮，点击切换对话抽屉）。

#### 左侧工具栏 `LeftToolbar`（悬浮，垂直居中，`z-[1200]`）

竖排工具条，两类按钮：

- **`RailAction`（36px 纯图标）**：
  - 「添加节点」（`PlusIcon`）——切换 `AddNodeMenu`；
  - 「鼠标工具」（cursor）与「抓手工具」（hand）——切换当前工具 `tool`，激活态白底高亮。抓手工具的图标经 CSS mask（`MaskIcon`）渲染自 `/images/canvas/icons/{mouse,hand}.svg`。
- **`RailSlot`（44px 带文字）**：
  - 「模版」——切换 `TemplatesPanel`；
  - 「历史」「帮助」——`disabled` 占位（半透明、禁用光标）。
- 「添加节点」处于打开态时，工具条右侧内联渲染 `AddNodeMenu`。

#### 画布节点 `CanvasNode`（`nodeTypes.canvas`）

自定义 React Flow 节点，`memo` 优化。四种 `kind`（markdown/image/video/audio）共享同一外壳：

- **标题行**：浮在卡片上方（`bottom: calc(100% + 4px)`），含类型图标 + 标题文字。双击标题进入编辑态（`input`，回车或失焦提交），通过 `updateNodeData(id, { title })` 写回。
- **卡片主体**（`NodeBody`）按 `kind` 分支：
  - `markdown`：可编辑 `textarea`（`nodrag`，防止拖动画布），占位来自 `NODE_KIND_META.markdown.placeholder`，输入实时写入 `data.text`；文本节点边框更深（`rgba(0,0,0,0.34)`）。
  - `image`：`data.src` 存在则显示图片，否则居中显示图片图标占位。
  - `video` / `audio`：居中显示对应类型图标占位。
- **缩放手柄**（`NodeResizer`）：仅选中时可见，`minWidth=220` / `minHeight=160`。
- **连线热区 + ＋号**（`ConnectionPlus`）：左右各一个不可见 `Handle`（左为 target、右为 source）内嵌一个大热区，hover 节点时淡入「＋」圆钮。单击「＋」派发 `window` 自定义事件 `canvas:plus-click`（携带 `nodeId`/`side`/鼠标坐标），由 `EditorInner` 监听后在光标处弹出 `AddNodeMenu`，用于「在该侧新建并连线一个节点」。

#### 底部控制条 `BottomControls`（悬浮左下，`z-[1200]`）

从左到右：小地图开关（`minimapOn` 高亮）、自动整理卡片（`onAutoArrange`）、分隔线、缩小、当前缩放百分比（`Math.round(zoom*100)%`）、放大、「重置」文字按钮（复位视口到 `{x:0,y:0,zoom:1}`）。

#### 右键菜单 `ContextMenu`（悬浮，`z-[1500]`）

两种 `kind`：

- **节点菜单（`node`）**：保存到本地（占位）、复制节点（`Ctrl+C`）、创建副本、粘贴（`Ctrl+V`）、删除（红色）。
- **画布菜单（`pane`）**：从本地上传（占位）、从素材库选择（占位）、分隔线、撤销（`disabled` 占位）、粘贴。

菜单会做视口边界钳制（clamp 左/上边缘防溢出）；「粘贴」是否可用取决于剪贴板是否有内容（`canPaste`）；点击外部或按 `Esc` 关闭。

#### 选中检视 `SelectionInspector`（悬浮，`z-[1350]`）

当且仅当「恰好选中一个节点」时渲染，由 `inspectorAnchor` 计算的屏幕坐标定位，随节点位置与视口缩放实时贴合。包含两部分：

- **顶部浮动工具条**（贴在节点上沿 `top-44`）：
  - `markdown` 节点：显示「N 字」字数、「帮我写」（空文本时禁用）、「展开」按钮。
  - 其他节点：「上传」「从资产库选择」按钮。
- **底部指令 / 生成器**（贴在节点下沿 `bottom+16`）：宽度自适应（420~660px）。含指令 `textarea`（占位来自 `NODE_KIND_META[kind].inspectorPlaceholder`，实时写回 `data.text`），右侧竖排动作（展开指令区 / 保存提示词-禁用 / 我的提示词）。底部一行左侧仅 `image` 节点显示三个下拉选择器（模型 `IMAGE_MODELS` / 比例 `IMAGE_ASPECTS` / 画质 `IMAGE_QUALITIES`）与「技能包」按钮；右侧显示积分单价（`✦ meta.price / meta.priceUnit`）与圆形发送钮（空文本时禁用变灰）。下拉选择器（`Selector`）点击外部自动收起。

#### 添加节点菜单 `AddNodeMenu`

共享组件，供左侧工具栏与节点「＋」两处使用。「添加节点」分组遍历 `ADD_NODE_ITEMS`（文本 / 图片 / 视频 / 音频），「添加资源」分组含「从本地上传」「从资产库选择」（`onResource` 回调，编辑器中为占位关闭）。

#### 模板面板 `TemplatesPanel`（悬浮，`z-[1250]`）

左侧工具栏右侧弹出的 320px 面板。标题「模板库」+ 关闭按钮，下方「我的模版 / 系统模版」双 Tab（`mine` 默认），内容区固定高度占位显示「暂无模版」。

#### 对话抽屉 `DialogDrawer`

顶栏「对话」按钮切换。开启时在编辑器右侧占据 `min(420px,42vw)` 宽度的独立列（挤压画布区，非悬浮遮挡）。含标题「新对话」、新建 / 历史 / 收起按钮；中部展示「试试这些 AI 技能」与三个技能药丸（`DIALOG_SKILLS`：素材分析 / 视频拆解 / 视频脚本）；底部为消息输入区（`textarea`，占位「输入消息，使用 @ 引用画布元素…」）、「选择技能」、已消耗积分与发送钮（空消息禁用）。

## 关键文件与组件

| 文件 | 职责 |
| --- | --- |
| `src/app/agent/ecommerce/canvas/page.tsx` | 落地页路由，服务端组件，仅渲染 `<CanvasLanding />`。 |
| `src/app/agent/ecommerce/canvas/[id]/page.tsx` | 编辑器路由，`async` 服务端组件；按 `id` 查 `CANVAS_PROJECTS` 得项目名传入 `<CanvasEditor />`。 |
| `src/app/agent/ecommerce/layout.tsx` | 路由段布局；判断 `pathname` 以 `/agent/ecommerce/canvas/` 开头时跳过 `WorkspaceShell`，其余包裹外壳。 |
| `src/components/daai/canvas/CanvasLanding.tsx` | 落地页 UI；含教程折叠状态、项目网格、内部子组件 `PlayBadge`、`ProjectActions`。 |
| `src/components/daai/canvas/CanvasEditor.tsx` | 编辑器核心；`ReactFlowProvider` + `EditorInner`，集中管理节点/连线/工具/菜单/视口全部状态与交互逻辑。 |
| `src/components/daai/canvas/CanvasNode.tsx` | 自定义画布节点（`nodeTypes.canvas`）；标题编辑、四类主体渲染、缩放、连线「＋」热区；导出 `CanvasNodeData` 类型。 |
| `src/components/daai/canvas/Topbar.tsx` | 顶部悬浮栏；项目下拉菜单、名称输入、积分/分享/对话入口。 |
| `src/components/daai/canvas/LeftToolbar.tsx` | 左侧竖排工具栏；导出 `CanvasTool` 类型，含 `MaskIcon`/`RailAction`/`RailSlot` 子组件。 |
| `src/components/daai/canvas/BottomControls.tsx` | 底部控制条；小地图、自动整理、缩放百分比、放大缩小、重置。 |
| `src/components/daai/canvas/AddNodeMenu.tsx` | 添加节点 / 添加资源菜单卡；被工具栏与节点「＋」复用。 |
| `src/components/daai/canvas/ContextMenu.tsx` | 右键菜单；导出 `CanvasMenuKind`/`CanvasMenuAction`，含节点/画布两套菜单项与边界钳制。 |
| `src/components/daai/canvas/SelectionInspector.tsx` | 选中节点检视/指令面板；导出 `InspectorAnchor` 类型，含 `Selector` 下拉子组件。 |
| `src/components/daai/canvas/TemplatesPanel.tsx` | 模板库悬浮面板；双 Tab + 空态占位。 |
| `src/components/daai/canvas/DialogDrawer.tsx` | 右侧对话抽屉；技能推荐 + 消息输入。 |
| `src/components/daai/canvas/icons.tsx` | 该模块全部内联 SVG 图标组件（节点/工具/顶栏/检视等）。 |
| `src/lib/canvas-data.ts` | 全部 mock 数据与常量、及画布类型定义（见下）。 |

## 数据来源

画布相关类型并未放在 `src/types/index.ts`（该文件无 canvas 内容），而是集中定义在 `src/lib/canvas-data.ts` 与各组件内：

- **`CanvasNodeKind`**（`canvas-data.ts`）：节点种类联合类型 `"markdown" | "image" | "video" | "audio"`。
- **`CanvasNodeData`**（`CanvasNode.tsx` 导出）：节点数据 `{ kind, title, text?, src?, [key]: unknown }`。
- **`CanvasProject` / `TutorialCard`**（`canvas-data.ts`）：项目卡与教程卡的数据结构。
- **`CanvasTool`**（`LeftToolbar.tsx`）：`"add" | "cursor" | "hand" | "template"`。
- **`CanvasMenuKind` / `CanvasMenuAction`**（`ContextMenu.tsx`）、**`InspectorAnchor`**（`SelectionInspector.tsx`）。

`src/lib/canvas-data.ts` 中的静态 mock 常量：

- **`CANVAS_TUTORIALS: TutorialCard[]`**：4 张新手教程（step / title / desc / image），封面图位于 `/images/canvas/tutorials/`。
- **`CANVAS_PROJECTS: CanvasProject[]`**：5 个示例项目，`id` 为 UUID、`name` 均为「未命名画布」、`updatedAt` 时间戳、无 `preview`（故落地页均显示「无预览」）。编辑器路由据此 `id` 反查项目名。
- **`NODE_KIND_META: Record<CanvasNodeKind, {...}>`**：四类节点的展示文案，含标题 `title`、节点内占位 `placeholder`、检视面板占位 `inspectorPlaceholder`、积分单价 `price` 与单位 `priceUnit`（文本 0.20/条、图片 1.18/张、视频 12.00/条、音频 0.60/条）。
- **`IMAGE_MODELS` / `IMAGE_ASPECTS` / `IMAGE_QUALITIES`**：图片节点检视面板三个下拉的选项（模型：高级版 VIP/标准版/极速版；比例：自适应/1:1/3:4/4:3/9:16/16:9；画质：标清·1K/高清·2K/超清·4K）。
- **`DIALOG_SKILLS`**：对话抽屉推荐技能（素材分析 / 视频拆解 / 视频脚本）。
- **`ADD_NODE_ITEMS`**：添加节点菜单的四项（文本 / 图片 / 视频 / 音频 → 对应 `kind`）。

其余尺寸常量在 `CanvasEditor.tsx` 内：`NODE_SIZE`（各类节点的默认宽高，如 markdown/image 320×220、video 360×220、audio 320×140）。

## 交互与状态

编辑器全部状态集中在 `EditorInner`（`CanvasEditor.tsx`），核心状态：`nodes`/`edges`（`useNodesState`/`useEdgesState`）、`tool`（当前工具）、`addMenuOpen`/`templatesOpen`/`dialogOpen`/`minimapOn` 四个开关、`viewport`（缩放平移）、`name`（画布名）、`ctx`（右键菜单）、`plusMenu`（节点「＋」弹出菜单）、`clipboardRef`（剪贴板节点，`useRef`）。

### 节点创建

- **左侧工具栏 / 命令面板添加**（`addNodeAtCenter`）：在视口中心创建选中节点，并按现有节点数做 `28px` 递增偏移，避免叠放；随后关闭添加菜单。节点 id 用 `node-{Date.now()}-{nodeSeq++}` 生成（`nodeSeq` 为模块级自增序号）。
- **双击画布**（`onPaneDoubleClick`）：仅在空白处（非落在 `.react-flow__node` 上）双击时，在光标处新建一个 `markdown` 节点。
- **节点「＋」连线新建**（`spawnConnectedNode`）：`CanvasNode` 派发的 `canvas:plus-click` 事件由 `useEffect` 监听，在光标处弹出 `AddNodeMenu`（`plusMenu`，`z-[1500]`，带全屏遮罩点击关闭并做边界钳制）；选择种类后在源节点左/右侧 `80px` 处创建新节点，同时按方向添加一条 `edge` 连线（右侧：源→新；左侧：新→源），新节点置为唯一选中。

### 节点选择与拖拽

- 单选：`selectedNode` 由 `nodes.filter(n => n.selected)` 得出，仅当恰好 1 个时非空，用于驱动 `SelectionInspector`。
- 拖拽：`nodesDraggable={tool !== "hand"}`——抓手工具下禁用节点拖动（改为拖动画布）；节点内 `textarea`/`input` 均加 `nodrag` 类避免误触发拖动。
- 右键选中：`onNodeContextMenu` 会把被右键的节点设为唯一选中并弹出节点菜单。

### 连线

- 手动连线：`onConnect` 用 `addEdge` 追加 `type:"default"` 边。
- `connectionMode=Loose` 允许宽松端点连接。

### 复制 / 粘贴 / 副本 / 删除

- **快捷键**（`useEffect` 监听 `keydown`）：`Ctrl/Cmd+C` 把当前选中节点存入 `clipboardRef`；`Ctrl/Cmd+V` 在视口中心粘贴副本。焦点在 `textarea`/`input`/`contentEditable` 时不触发。
- **右键菜单动作**（`handleMenuAction`）：`delete` 删除节点并清理相关连线；`duplicate` 就地偏移 `+40,+40` 生成副本（`spawnCopy`）；`copy` 存入剪贴板；`paste` 在右键坐标（`screenToFlowPosition` 转换后居中）粘贴。`save`/`upload`/`asset`/`undo` 为占位 no-op。
- `spawnCopy` 生成新 id、深拷贝 `data`、置为唯一选中。

### 缩放 / 视口 / 布局

- 缩放：底部控制条调用 `rf.zoomIn`/`zoomOut`/`setViewport`（重置），均带动画时长；`onMove`/`onInit` 同步 `viewport` 状态以驱动百分比显示与检视面板重定位。
- **自动整理**（`autoArrange`）：按 `ceil(sqrt(节点数))` 列数网格重排（列距 380、行距 300），下一帧 `fitView` 适配全部节点。
- 小地图：`minimapOn` 切换渲染 `<MiniMap>`。

### 菜单开合互斥

左侧工具栏切换工具或打开添加菜单/模板面板时相互关闭（`setAddMenuOpen`/`setTemplatesOpen` 互斥）；点击画布空白（`onPaneClick`）会一次性关闭添加菜单、模板面板、右键菜单与「＋」菜单。顶栏项目菜单、右键菜单、检视下拉均实现「点击外部关闭」，右键菜单额外支持 `Esc` 关闭。

### 检视面板定位

`inspectorAnchor`（`useMemo`）用 `flowToScreenPosition` 把选中节点的左上/右下角换算成相对包裹容器的屏幕坐标，并把 `viewport` 纳入依赖，从而在平移/缩放/移动节点时实时贴合；`updateSelectedText` 经 `rf.updateNodeData` 写回选中节点文本。

### mock 边界

积分固定为 `0`，发送/生成/保存/模板/历史/帮助/上传/资产库/分享/对话发送等按钮均为占位，不产生实际请求或数据变更。

## 布局特殊处理

`src/app/agent/ecommerce/layout.tsx` 是电商路由段的客户端布局，用 `usePathname()` 判断当前路径：

```
if (pathname?.startsWith("/agent/ecommerce/canvas/")) {
  return <>{children}</>;        // 全屏编辑器，跳过外壳
}
return <WorkspaceShell>{children}</WorkspaceShell>;
```

- **编辑器 `/agent/ecommerce/canvas/[id]`** 命中前缀 `/agent/ecommerce/canvas/`，直接返回 `children`，**跳过 `WorkspaceShell`**——因为编辑器自带完整 chrome（浮层顶栏、左侧工具栏、底部控制条等）并需要 `h-dvh` 占满整个视口，若再套一层工作台侧边栏 + 内容内边距，会破坏全屏无限画布的交互与布局。
- **落地页 `/agent/ecommerce/canvas`**（注意：末尾无 `/`，不匹配前缀判断）仍走 `WorkspaceShell` 分支，从而与工作台其余菜单共享同一侧边栏导航与页面外壳。

即：**是否跳过外壳的分界点是 `/canvas/` 这个带尾斜杠的前缀**——落地页保留外壳，任意具体画布（含 `new`）进入全屏。

## 备注

- 对应 da-ai.cc/canvas，属 1:1 像素级克隆；这是本工作台交互最复杂的模块。
- 编辑器基于 `@xyflow/react`（React Flow）构建，`import "@xyflow/react/dist/style.css"` 引入其基础样式，自定义样式类（如 `canvas-flow`、`--canvas-*` CSS 变量）配合像素级还原。
- 全部数据为 `src/lib/canvas-data.ts` 中的静态 mock，无接口、无持久化；节点/连线/缩放等编辑状态仅存于组件内存，刷新即丢失。
- 大量业务动作为占位 UI：积分恒为 0，发送/生成/保存提示词/模板库/历史/帮助/上传/从资产库选择/分享/导出/复制项目/对话发送等均未绑定真实逻辑；可用的交互限于节点增删改、拖拽、缩放、连线、复制粘贴、副本、自动整理、菜单开合与文本编辑。
- 资源依赖：`/images/canvas/tutorials/`（教程封面）、`/images/canvas/icons/{mouse,hand}.svg`（工具栏 mask 图标）、`/images/logo/da-ai.svg`（顶栏 logo）。
