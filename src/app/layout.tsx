import type { Metadata } from "next";
import { Geist_Mono, Space_Grotesk } from "next/font/google";
import { SiteLoader } from "@/components/site-loader";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "杨曦哲 | 用 AI 解决真实痛点",
  description:
    "杨曦哲的个人网站：用 AI 与工程解决真实痛点的超级个体；黑客松产品、演讲与自媒体「喜欢编程的杨同学」。",
  icons: {
    icon: "/profile-presentation.jpg?v=3",
    shortcut: "/profile-presentation.jpg?v=3",
    apple: "/profile-presentation.jpg?v=3",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${display.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteLoader />
        {children}
      </body>
    </html>
  );
}
