import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteLoader } from "@/components/site-loader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "杨曦哲 | 个人网站",
  description:
    "杨曦哲的个人网站：编程、人工智能、黑客松与自媒体。GitHub yxz6811，联系邮箱 3978401510@qq.com。",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteLoader />
        {children}
      </body>
    </html>
  );
}
