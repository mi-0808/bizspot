import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Noto_Sans_JP } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
});

const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "BizSpot",
  description: "ロケーションでスペースを探し、マッチで近くの人とつながれるビジネス向けモバイルアプリ",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "BizSpot",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#e8f3ff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${plusJakartaSans.variable} ${notoSansJp.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
