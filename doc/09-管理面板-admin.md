# 09 管理面板（admin）
> 路由：`/agent/ecommerce/admin` · 入口：`src/app/agent/ecommerce/admin/page.tsx`

## 功能概述
「管理面板」页面（组件名 `AdminPage`）用于展示**当前登录管理员的账号、积分概览与后台入口**。页面为轻量的概览页：顶部标题卡说明用途，中部三张统计卡展示账号/积分状态，底部快捷入口卡提供跳转到设置、积分与完整后台的链接。

该页面为 `"use client"` 客户端组件，展示数据均为页面内硬编码常量，暂无真实后端数据。

## 页面结构
自上而下的整体布局（最外层 `div.space-y-4`）：

1. **Header 卡片**：
   - 左侧：黑色圆角图标块（`Sparkles`）+ 标题「管理面板」+ 副标题「当前登录管理员的账号、积分和后台入口。」。
   - 右侧：「完整管理台」按钮（`Link`，`ExternalLink` 图标，`href="#"`）。
2. **统计卡区**：三列栅格（`md:grid-cols-3`），由 `StatCard` 渲染：
   - **当前账号**：`UserCog` 图标，值「管理员」，meta「admin」，色调 `primary`。
   - **可用积分**：`Infinity` 图标，值「无限」，meta「累计消耗 0」，色调 `blue`。
   - **冻结积分**：`Clock` 图标，值「0」，meta「进行中的视频任务预占」，色调 `slate`。
3. **快捷入口卡**：
   - 头部：标题「快捷入口」+ 说明文案 + 右侧 `Shield` 图标。
   - 三列栅格，遍历 `QUICK_LINKS` 渲染 `Link` 卡片，含图标、标题、两行截断描述（`line-clamp-2`）。

## 关键文件与组件
| 文件 | 职责 |
| --- | --- |
| `src/app/agent/ecommerce/admin/page.tsx` | 页面全部实现：默认导出 `AdminPage`，内含 `StatCard` 子组件与 Mock 数据 |
| `AdminPage`（同文件） | 页面主组件，组织 Header、统计卡与快捷入口整体布局 |
| `StatCard`（同文件） | 统计卡子组件，按 `iconTone`（`primary`/`blue`/`slate`）切换图标配色，展示 `value / label / meta` |
| `next/link` → `Link` | 快捷入口与「完整管理台」的跳转链接 |
| `lucide-react` 图标 | `Clock / Coins / ExternalLink / Infinity(as InfinityIcon) / Settings2 / Shield / Sparkles / UserCog` |

## 数据来源
全部为页面内硬编码常量，**未引用** `src/lib/daai-data.ts`、`src/lib/mock-data.ts` 或 `src/types/index.ts`：

- `QUICK_LINKS`：快捷入口数组，每项含 `href / title / description / icon`，三项为：
  - 「账号与团队」→ `/agent/ecommerce/settings`（`Settings2`）；
  - 「积分与订阅」→ `/agent/ecommerce/credits`（`Coins`）；
  - 「完整管理台」→ `#`（`ExternalLink`）。
- 三张统计卡的 `value / label / meta / iconTone` 直接作为 props 内联写死在 `AdminPage` 中。
- `StatCardProps` 接口在同文件内定义（`icon / value / label / meta / iconTone`），未使用全局类型。

## 交互与状态
- 页面**无任何 `useState`/`useEffect`**，为纯展示型静态组件。
- 快捷入口与「完整管理台」通过 `next/link` 的 `Link` 实现跳转；其中「账号与团队」「积分与订阅」指向真实站内路由，「完整管理台」两处 `href` 均为 `#`（占位，不实际跳转）。
- 快捷入口卡片仅有 hover 视觉反馈（上移、边框高亮、阴影），无点击回调逻辑。

## 备注
- 「账号与团队」快捷入口指向 `/agent/ecommerce/settings`，即本套文档中的 08 账号与设置页面。
- 「积分与订阅」指向 `/agent/ecommerce/credits`，需该路由存在方可正常跳转。
- 积分相关数值（「无限」「累计消耗 0」「冻结积分 0」）均为静态占位，非真实账户数据。
- 全页为静态克隆演示，尚无后台数据接入或管理操作能力。
