import { HomeComposer } from "@/components/daai/HomeComposer";
import { EcommerceToolCards } from "@/components/daai/EcommerceToolCards";
import { DiscoverFeed } from "@/components/daai/DiscoverFeed";
import { Footer } from "@/components/daai/Footer";

// 首页：HomeComposer（文案提取 + 快速成片下拉 + 提取结果）
// + DiscoverFeed（成品展示）+ Footer。外层侧边栏沿用统一后的 WorkspaceShell。
export default function HomePage() {
  return (
    <>
      <div className="mx-auto flex w-full flex-col items-center pb-8 sm:pb-12">
        <HomeComposer />
      </div>
      <EcommerceToolCards />
      <DiscoverFeed />
      <Footer />
    </>
  );
}
