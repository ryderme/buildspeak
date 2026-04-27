import type { Metadata } from "next";
import { Suspense } from "react";
import { PostHogProvider } from "@/components/posthog-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "BuildSpeak — 跟着 builder 读 AI",
  description: "每天从一份精选名单抓取 AI builders 的播客、推文与官方博客，整理成双语 issue。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;0,8..60,700;1,8..60,400&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+SC:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Suspense fallback={null}>
          <PostHogProvider>
            <div className="app-shell">{children}</div>
          </PostHogProvider>
        </Suspense>
      </body>
    </html>
  );
}
