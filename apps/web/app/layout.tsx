import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BuildSpeak — 跟着 AI builder 学英文",
  description: "每天 5–10 分钟，读 AI builder 真实在说什么，顺便练好英文。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
