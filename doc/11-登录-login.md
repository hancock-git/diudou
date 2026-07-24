# 11 登录（login）

> 路由：`/login` · 入口：`src/app/login/page.tsx` · 独立布局：`src/app/login/layout.tsx`

## 功能概述

登录页是应用的账号入口，采用左右两栏卡片式设计：左栏为品牌宣传区（模拟工作台预览），右栏为登录表单。页面属于侧栏底部区「退出」动作的落点——`SIDEBAR_BOTTOM` 中 `logout` 项的 `href` 指向 `/login`。核心行为：填写密码后提交，前端直接跳转到工作台首页 `/agent/ecommerce/home`，不做任何真实鉴权。

## 页面结构

页面根节点 `LoginPage` 为全屏渐变背景，居中放置一张 `max-w-[960px] × h-[600px]` 的圆角卡片，卡片内分两栏：

1. **左栏 —— 品牌宣传区**（`w-[55%]`，深色渐变，`md` 及以上才显示）：
   - 两处径向光晕装饰（蓝 `#0471fe`、紫 `#7c3aed`）。
   - 顶部预览卡：标题「智能带货工作台」+ 副标题「素材 · 文案 · 分镜 · 成片」+「Live」徽标；下方 5 条模拟进度行（AI 文案提炼 92%、生成 9:16 带货短视频、分镜时间线 15s、商品图识别 卖点 6 个、成片预览 自动生成中）。
   - 底部文案块：标签「AI 电商内容工作台」、大标题「丢抖AI电商智能体助手」、描述文案。
2. **右栏 —— 登录表单**（`w-full md:w-[45%]`）：
   - 右上角「关闭」按钮（`X` 图标，`Link` 指向 `/`）。
   - 顶部胶囊「安全账号中心」（`Lock` 图标）。
   - 标题「欢迎回来」+ 副标题「登录后继续使用你的工作台和资产库。」。
   - Tab 切换：「账号登录」/「手机号注册」两个页签。
   - 表单：账号输入框（`账号 / 手机号 / 邮箱`）、密码输入框、提交按钮「登录」（`ChevronRight` 图标）。
   - 底部提示文案（关于手机号注册与邀请码一次性使用的说明）。

## 关键文件与组件

| 文件 | 职责 |
| --- | --- |
| `src/app/login/page.tsx` | 登录页入口，`"use client"`，含表单状态、提交跳转与全部 UI（单文件自包含）。 |
| `src/app/login/layout.tsx` | 登录路由段的独立布局，仅返回 `<>{children}</>`，用于隔离全局工作台外壳。 |
| `src/lib/mock-data.ts`（`SIDEBAR_BOTTOM`） | `logout` 项 `href: "/login"`，是工作台内进入登录页的入口。 |
| `src/lib/utils.ts`（`cn`） | 条件拼接 className（Tab、按钮态）。 |

依赖的第三方：`next/link`（`Link`）、`next/navigation`（`useRouter`）、`lucide-react` 图标（`Bot` / `ChevronRight` / `ImageIcon` / `Lock` / `Play` / `Sparkles` / `Video` / `Wand2` / `X`）。

## 关于独立 layout

`src/app/login/layout.tsx` 是 `/login` 路由段专属布局，实现为透传：

```tsx
export default function LoginLayout({ children }) {
  return <>{children}</>;
}
```

其作用是让登录页脱离 `agent/ecommerce` 等分组下的侧栏 / 顶栏工作台外壳，独立铺满整屏渲染自己的登录卡片。页面自身通过 `min-h-dvh` + 渐变背景 + 居中布局承担完整视觉，无需上层 layout 注入结构。

## 数据来源

登录页无外部数据依赖，`daai-data.ts` / `mock-data.ts` 仅提供入口链接（`SIDEBAR_BOTTOM` 的 `logout`）。页面内容为静态文案与硬编码的模拟预览数据（进度百分比、卖点数量等均为写死的展示值）。

表单相关类型定义于本文件：`type LoginTab = "account" | "phone"`。

## 交互与状态

- 通过 `useState` 维护三个状态：
  - `tab: LoginTab`，默认 `"account"`；点击页签切换「账号登录 / 手机号注册」，激活态白底高亮。
  - `account: string`，默认预填 `"admin"`。
  - `password: string`，默认空。
- `canSubmit = password.trim().length > 0`：仅当密码非空时可提交；否则登录按钮为禁用样式（`cursor-not-allowed`、半透明主色）。
- `handleSubmit`：阻止默认提交，若 `!canSubmit` 直接 `return`，否则 `router.push("/agent/ecommerce/home")` 跳转到工作台首页。
- 「关闭」按钮为 `Link`，跳转到站点首页 `/`。
- Tab 切换仅改变高亮样式，**不改变表单字段**——两个页签共用同一套账号 / 密码输入框。

## 备注

- 登录为纯前端模拟：不校验账号、不校验密码正确性，只要密码非空即视为成功并跳转。账号默认预填 `admin`。
- 左栏在移动端（`md` 以下）隐藏，仅展示右侧表单栏。
- 顶部预览卡的进度、徽标、动画（`animate-pulse` / `animate-ping`）均为纯视觉装饰，无数据驱动。
