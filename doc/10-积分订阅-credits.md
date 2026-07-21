# 10 积分与订阅（credits）

> 路由：`/agent/ecommerce/credits` · 入口：`src/app/agent/ecommerce/credits/page.tsx`

## 功能概述

「我的积分」页面用于展示当前账户的积分总览与积分消费/退款/充值明细。页面为纯前端展示型，属于侧栏底部区功能（非主菜单），侧栏底部「无限（可用积分）」与「订阅」两项均通过 `href` 指向本路由。核心能力：

- 顶部积分总览卡：展示可用积分（当前恒为「无限」）、订阅积分、充值积分，并提供「兑换充值卡」「订阅 / 充值」「刷新」等操作按钮（均为纯 UI，未绑定实际逻辑）。
- 积分明细卡：按「类型」和「工具」两组筛选条件过滤交易流水列表，支持空态提示。

## 页面结构

页面根节点为 `CreditsPage`，整体为 `space-y-4` 纵向堆叠，自上而下：

1. **标题行**：左侧标题「我的积分」，右侧「刷新」按钮（`RefreshCw` 图标）。
2. **积分总览卡**（圆角白卡）：
   - 左侧：`可用积分` 大号数值「无限」，附注文案 `= 订阅积分 0.00 + 充值积分 无限`。
   - 右侧：两个 `MiniStat`（订阅积分 `0.00`、充值积分 `无限`），以及「兑换充值卡」（`TicketCheck`）、「订阅 / 充值」（`Wallet`，深色主按钮）两个按钮。
3. **积分明细卡**：
   - 卡头：标题「积分明细」+「发票管理」入口（`Receipt` 图标，带 `›`）。
   - 筛选区：两行 `FilterRow`（「类型」「工具」），每行由若干 `FilterPill` 胶囊按钮组成。
   - 流水列表：`divide-y` 分隔的 `TransactionRow` 列表；筛选结果为空时展示 `CircleAlert` 图标 + 文案「当前筛选条件下暂无记录。」。

## 关键文件与组件

| 文件 | 职责 |
| --- | --- |
| `src/app/agent/ecommerce/credits/page.tsx` | 页面入口，含全部数据、类型、子组件与筛选逻辑（单文件自包含）。 |
| `src/lib/mock-data.ts`（`SIDEBAR_BOTTOM`） | 定义侧栏底部 `credits` / `billing` 两项，`href` 均为 `/agent/ecommerce/credits`，是本页入口来源。 |
| `src/components/Sidebar.tsx` | 渲染侧栏底部项，`BOTTOM_STYLES` 定义 `credits` / `billing` 变体样式。 |
| `src/lib/utils.ts`（`cn`） | 条件拼接 className。 |

页面内定义的子组件：

- `MiniStat`（`label` / `value` / `meta`）：右对齐的小型数值块，用于订阅积分、充值积分。
- `FilterRow`（`label` / `children`）：筛选行容器，左侧灰色标签 + 右侧胶囊组。
- `FilterPill`（`active` / `onClick` / `children`）：胶囊筛选按钮，激活态为深色实心，非激活态为浅灰。
- `TransactionRow`（`tx`）：单条流水行，含工具图标、标题、日期、工具标签、金额与余额。

## 数据来源

数据全部为页面内硬编码常量，未从 `daai-data.ts` / `mock-data.ts` 引入交易数据（仅入口链接来自 `mock-data.ts` 的 `SIDEBAR_BOTTOM`）：

- `TX: Transaction[]`：20 条交易流水（`id` 1–20）。绝大多数为 `consume`（视频/图片生成）与 `refund`（生成失败退回），最后一条 `id: "20"` 为 `topup`「系统初始化管理员积分」`amount: 100000`。注意：除该条外，其余记录的 `amount` 均为 `0`，`balance` 均为 `100000`。
- `TYPE_FILTERS`：类型筛选项，`all` / `consume` / `refund` / `topup` / `expire`，标签为「全部 / 消费 / 退款 / 积分充值 / 过期」。
- `TOOL_FILTERS`：工具筛选项，`all` / `video-gen` / `image-gen` / `video-cut` / `subtitle-erase` / `quality-boost` / `prompt-gen`。

相关类型（均定义于本文件）：

- `TxType = "consume" | "refund" | "topup" | "expire"`
- `Tool = "video-gen" | "image-gen" | "video-cut" | "subtitle-erase" | "quality-boost" | "prompt-gen" | "other"`
- `Transaction`：`id` / `title` / `type` / `tool` / `toolLabel` / `date` / `amount` / `balance` / 可选 `refund`。

## 交互与状态

- 组件通过 `useState` 维护两个筛选状态：`typeFilter`（默认 `"all"`）与 `toolFilter`（默认 `"all"`）。
- `filtered` 由 `useMemo` 计算：先按 `type` 过滤（`all` 时不过滤），再按 `tool` 过滤，依赖 `[typeFilter, toolFilter]`。
- 点击 `FilterPill` 调用对应 `setTypeFilter` / `setToolFilter` 切换筛选；激活胶囊高亮为深色。
- `TransactionRow` 内的展示派生逻辑：
  - 图标：`tool === "video-gen"` 用 `FileVideo`（主色底），否则用 `FileImage`（紫色底）。
  - 金额文案 `amountText`：`amount === 0` 显示 `"0"`；`> 0` 显示 `+` 前缀千分位；`< 0` 显示千分位负数。
  - 金额颜色 `amountCls`：正数 `emerald`，负数 `rose`，`refund` 为 `rose-400`，其余为 `slate-400`；退款记录标题也置为 `rose-500`。
  - 余额列在 `sm` 以上断点显示，宽 `w-24`。
- 「刷新」「兑换充值卡」「订阅 / 充值」「发票管理」按钮当前均无 `onClick` 逻辑，仅为静态 UI。

## 备注

- 该页为 1:1 克隆的展示型页面，无接口请求、无路由跳转逻辑；所有数值（含「无限」「0.00」「100,000」）均为示例数据。
- 侧栏底部两项（`credits`「无限」与 `billing`「订阅」）指向同一路由，页面本身不区分来源。
- `expire`（过期）类型仅存在于筛选项中，`TX` 数据里当前没有该类型记录，因此选中「过期」会触发空态。
