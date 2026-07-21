# 丢抖AI 电商工作台 · 技术文档

本目录是对 **da-ai.cc「丢抖AI 电商工作台」** 像素级克隆项目的中文技术文档，**按左侧菜单功能划分**，每个菜单模块一份。数据均为内置 mock 静态数据，无后端。

## 阅读顺序

1. 先读 [`00-架构与技术栈.md`](./00-架构与技术栈.md) —— 技术栈、目录结构、路由、设计令牌、质量门禁。
2. 再按需查阅各菜单模块文档。
3. 跨模块的布局外壳与公共组件见 [`12-公共组件与布局.md`](./12-公共组件与布局.md)。

## 文档索引

### 架构
- [00 架构与技术栈](./00-架构与技术栈.md)
- [12 公共组件与布局](./12-公共组件与布局.md)（Sidebar / Header / WorkspaceShell / 根布局 / 类型 / mock 数据）

### 侧栏主菜单

| # | 菜单 | 路由 | 文档 |
| --- | --- | --- | --- |
| 01 | 首页 | `/agent/ecommerce/home` | [01-首页-home.md](./01-首页-home.md) |
| 02 | 超级编导 | `/agent/ecommerce/copywriting` | [02-超级编导-copywriting.md](./02-超级编导-copywriting.md) |
| 03 | 高级画布 | `/agent/ecommerce/canvas`、`/canvas/[id]` | [03-高级画布-canvas.md](./03-高级画布-canvas.md) |
| 04 | 爆款裂变 | `/agent/ecommerce/remix` | [04-爆款裂变-remix.md](./04-爆款裂变-remix.md) |
| 05 | 视频成片 | `/agent/ecommerce/video` | [05-视频成片-video.md](./05-视频成片-video.md) |
| 06 | AI生图 | `/agent/ecommerce/image` | [06-AI生图-image.md](./06-AI生图-image.md) |
| 07 | 资产库 | `/agent/ecommerce/assets` | [07-资产库-assets.md](./07-资产库-assets.md) |
| 08 | 账号与设置 | `/agent/ecommerce/settings` | [08-账号与设置-settings.md](./08-账号与设置-settings.md) |
| 09 | 管理面板 | `/agent/ecommerce/admin` | [09-管理面板-admin.md](./09-管理面板-admin.md) |

### 侧栏底部区 / 独立页

| # | 模块 | 路由 | 文档 |
| --- | --- | --- | --- |
| 10 | 积分与订阅 | `/agent/ecommerce/credits` | [10-积分订阅-credits.md](./10-积分订阅-credits.md) |
| 11 | 登录 | `/login` | [11-登录-login.md](./11-登录-login.md) |

> 补充：`/agent/ecommerce/library`（文案/分镜库）由顶栏快捷入口进入，其说明并入 [07-资产库文档](./07-资产库-assets.md)。

## 约定

- 各文档以**真实代码为准**撰写；页面若为静态原型（数据内联、按钮为占位），文档已如实标注。
- 文件路径、路由均以行内代码给出，便于点击定位。
- 修改代码后，请同步更新对应菜单模块文档。
