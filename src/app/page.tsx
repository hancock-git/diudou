import { redirect } from "next/navigation";

// 电商工作台首页统一在 `/agent/ecommerce/home`（带 WorkspaceShell 侧边栏）。
// 根路由重定向过去，保持与侧边栏"首页"入口一致。
export default function RootPage() {
  redirect("/agent/ecommerce/home");
}
