# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

> `AGENTS.md`（连同 `README.md`）描述的是「通用网站克隆模板」。本文件补充的是**该模板已构建出的具体应用**的架构与约定——两者需一起阅读。

## 这个仓库实际是什么

`dd/` 目录是一个**已完成的、像素级（1:1）静态克隆**：目标站是 **da-ai.cc「丢抖AI 电商工作台」**（AIGC 电商素材创作平台）。它不是待填充的空模板。

- **纯前端、无后端**：所有数据是内置 mock（`src/lib/*.ts` 或页面内联常量），无接口、无持久化、无鉴权。登录页密码非空即跳转，画布等编辑状态仅存组件内存、刷新即丢。
- **大量按钮是有意的占位（no-op）**：「提取文案 / 保存 / 生成 / 快速成片 / 分享」等常见业务动作多为纯 UI 占位。**改动前别把占位当 bug 修**——除非任务明确要求补功能。
- **像素级还原优先**：`globals.css` 的设计令牌逐值抄自目标站 `getComputedStyle`（主色 `#0471fe`）。在还原语境下不要按个人审美改间距/配色/字号。

## 目录级 git 陷阱（重要）

Git 仓库根是 **`dd/` 的上一级 `aliyun-repo/`**，不是 `dd/` 本身。该仓库还并存 `vue-todolist`、`react-todolist` 等其它项目。

- 提交/推送在**上级根**执行，路径带 `dd/` 前缀（如 `git add dd/...`）。
- 推送前先 `git pull`（用户全局规则）。历史直接提交到 `main`。

## 架构大图（需读多文件才能理清的部分）

### 路由与导航是数据驱动的
- 根路由 `src/app/page.tsx` 直接 `redirect("/agent/ecommerce/home")`。
- 所有工作台页面在 `src/app/agent/ecommerce/<menu>/`。侧栏菜单项**不是**硬编码在 `Sidebar.tsx`，而是由 `src/lib/mock-data.ts` 的 `SIDEBAR_NAV`（主菜单）与 `SIDEBAR_BOTTOM`（积分/订阅/退出）驱动。新增菜单页 = 加路由目录 + 往这两个数组加项。

### 布局外壳有一个例外分支
`src/app/agent/ecommerce/layout.tsx` 用 `usePathname()` 判断：路径以 **`/agent/ecommerce/canvas/`（带尾斜杠）** 开头时**跳过 `WorkspaceShell`**（返回裸 `children`），其余全部包 `WorkspaceShell`（侧栏 + 顶栏 + 滚动主区）。
- 命中例外的只有**全屏画布编辑器** `/agent/ecommerce/canvas/[id]`（含 `new`）——它自带完整 chrome 且需 `h-dvh` 占满视口。
- 画布**落地页** `/agent/ecommerce/canvas`（无尾斜杠）不命中，仍在外壳内、与其它菜单共享侧栏。

### 高级画布是复杂度中心
`src/components/daai/canvas/` 是基于 **`@xyflow/react`（React Flow）** 的节点式编辑器，全部编辑状态集中在 `CanvasEditor.tsx` 的 `EditorInner`。数据/常量在 `src/lib/canvas-data.ts`。注意：**画布相关的 TS 类型定义在各组件与 `canvas-data.ts` 内，不在 `src/types/index.ts`**。其余菜单页复杂度远低于此。

### Mock 数据不完全集中
- `src/lib/mock-data.ts`：跨模块共享（侧栏、提取 tab、创作广场等）。
- `src/lib/{daai,assets,canvas}-data.ts`：部分模块数据。
- **但多数模块页（remix / video / image / settings / admin / credits 等）把 mock 写成页面内联常量**，未收敛到 `lib/`。改某页数据时先确认它读的是 `lib/` 还是自身内联常量。

## 两个 docs 目录别混淆
- **`doc/`**（单数）：按侧栏菜单功能划分的中文技术文档（每菜单一篇 + 架构/公共组件/README 索引）。**改了某菜单的代码，同步更新对应 `doc/NN-*.md`。**
- **`docs/`**（复数）：克隆过程产物——`docs/research/components/*.spec.md`（含目标站精确 computed CSS 的组件规格）、`docs/design-references/*.png`（对照截图）。做还原/校准时参考它，不要往这里写业务文档。

## 常用命令
```bash
npm run dev        # 开发服务器（Turbopack）
npm run check      # lint + typecheck + build 一把梭（提交前跑这个）
npm run lint       # 单独 ESLint
npm run typecheck  # 单独 tsc --noEmit
npm run build      # 生产构建
```
无测试套件（本项目为静态 UI 克隆，未配置单测/e2e）。校验以 `npm run check` 全绿为准（当前 0 error / 0 warning）。Node 需 24+。
