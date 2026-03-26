import type { Metadata } from "next";
import { Cinzel } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "600", "700", "900"],
  display: "swap",
});

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
    <html lang="ko" className={cinzel.variable}>
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
