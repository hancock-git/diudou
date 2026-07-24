import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "丢抖AI电商官网- 丢抖AI电商视频与商品图生成平台",
  description:
    "丢抖AI（丢抖AI电商）是面向电商商家、运营和投流团队的AIGC素材创作平台，支持AI视频生成、AI商品图、商品详情套图、帮我写、投流素材批量制作、爆款视频裂变、去字幕与画质增强。",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/seo/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/seo/apple-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
