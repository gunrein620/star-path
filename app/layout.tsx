import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AstroPulse - AI 별자리 운세",
  description: "AI가 당신의 별자리로 오늘의 운세를 알려드립니다",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
