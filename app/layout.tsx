import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AI 助手 Token 用量分析",
  description: "Token 用量分析看板",
  icons: {
    icon: "/Token计算logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`h-full antialiased ${inter.className}`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}