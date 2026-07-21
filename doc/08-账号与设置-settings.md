# 08 账号与设置（settings）
> 路由：`/agent/ecommerce/settings` · 入口：`src/app/agent/ecommerce/settings/page.tsx`

## 功能概述
「账号与设置」页面（组件名 `SettingsPage`，代码内标题为「模型与生成设置」）集中展示工作台默认使用的**视频模型、图片模型和输出规格**，并提供进入各生成工作台的快捷入口。页面定位为只读的配置概览页：查看和保存配置不消耗积分，只有真正执行图片/视频生成任务时才扣积分。单次任务生成时仍可临时覆盖这些默认值。

该页面为 `"use client"` 客户端组件，全部展示数据均为页面内硬编码的静态常量（当前未接入真实接口或全局数据）。

## 页面结构
自上而下的整体布局（最外层 `div.space-y-4`）：

1. **面包屑（Breadcrumb）**：`账户中心 / 模型与生成`。
2. **顶部 Header 卡片**：
   - 左侧：主标题「模型与生成设置」+ 绿色状态徽标「默认配置已就绪」（`CheckCircle2` 图标）+ 一段说明文案。
   - 右侧：管理员账号信息卡（`UserCircle`，显示「管理员 / 管理员账号」）、「进入视频生成」次要按钮、「管理完整配置」主按钮（`ArrowUpRight`）。
3. **主内容区**：两列栅格 `lg:grid-cols-[minmax(0,1fr)_320px]`，左主区 + 右侧栏。
   - **左主区（4 个 section）**：
     - **当前默认模型**：右上角「丢抖AI 推荐方案」徽标；两张模型卡（默认视频模型 `Seedance-2.0-VIP`，副标 `doubao-seedance-2-0-260128`；默认图片模型 `gpt-image-2`），每张卡带「默认」小胶囊（`DefaultChip`）。
     - **默认视频规格**：右上角「去调整本次任务」按钮；两块规格卡（清晰度 `720p`、画面比例 `9:16`）；底部一条「当前工作台与默认设置一致」提示条与「当前工作台：720p · 9:16 / 默认：720p · 9:16」对比行。
     - **配置状态**：三格栅格，遍历 `CONFIG_STATUS` 渲染（视频生成模型 / 图片生成模型 / 输出规格）。
     - **快捷入口**：三格栅格，遍历 `QUICK_ENTRIES` 渲染可点选卡片。
   - **右侧栏（`aside`，`lg:sticky`）**：账户余额卡，显示「无限」可用积分、说明文案与「查看积分与消耗」按钮（`Wand2`）。

## 关键文件与组件
| 文件 | 职责 |
| --- | --- |
| `src/app/agent/ecommerce/settings/page.tsx` | 页面全部实现：默认导出 `SettingsPage`，内含子组件、Mock 数据与所有 UI |
| `SettingsPage`（同文件） | 页面主组件，维护快捷入口选中状态，组织整页布局 |
| `Breadcrumb`（同文件） | 面包屑子组件，渲染「账户中心 / 模型与生成」 |
| `DefaultChip`（同文件） | 「默认」小胶囊标签，用于模型卡右上角 |
| `src/lib/utils.ts` → `cn()` | 合并 Tailwind class，用于快捷入口卡片的条件样式 |
| `lucide-react` 图标 | `Sparkles / Video / ImagePlus / CheckCircle2 / ArrowUpRight / FileText / UserCircle / Wand2` |

## 数据来源
全部为页面内硬编码的静态常量，**未引用** `src/lib/daai-data.ts`、`src/lib/mock-data.ts` 或 `src/types/index.ts`：

- `QUICK_ENTRIES`：快捷入口数组，类型键 `QuickKey = "video" | "image" | "credits"`，每项含 `key / title / description / icon`。三项分别为「开始生成视频」「生成商品图片」「查看积分记录」。
- `CONFIG_STATUS`：配置状态数组，三项（`视频生成模型 = Seedance-2.0-VIP`、`图片生成模型 = gpt-image-2`、`输出规格 = 720p · 9:16`）。
- 模型卡、视频规格（`720p`、`9:16`）、账户余额（「无限」）等文案直接内联写死在 JSX 中。

## 交互与状态
- 唯一的组件状态：`const [selectedQuick, setSelectedQuick] = useState<QuickKey | null>(null)`。
- **快捷入口卡片**：点击时执行 `setSelectedQuick(isActive ? null : entry.key)`，即再次点击已选中项会取消选中（切换/反选逻辑）；选中态通过 `cn()` 切换高亮边框、`ring` 环、图标反色与 `ArrowUpRight` 颜色。
- 其余按钮（进入视频生成、管理完整配置、去调整本次任务、查看积分与消耗等）均为纯静态 `button`/展示元素，**未绑定任何点击处理或路由跳转**。
- 页面无数据请求、无副作用（无 `useEffect`），刷新后状态重置。

## 备注
- 代码内页面标题为「模型与生成设置」，与菜单名「账号与设置」不完全一致；面包屑归属于「账户中心 / 模型与生成」。
- 图片模型卡的主标题与副标题同为 `gpt-image-2`。
- 账户余额固定显示「无限」，为纯展示占位，非真实积分数据。
- 全页为静态克隆演示，尚无表单编辑、保存或后端交互能力。
