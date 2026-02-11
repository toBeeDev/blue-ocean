import type { Metadata } from "next";
import { Outfit, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  weight: ["300", "400", "500", "600", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Blue Ocean — 내 근처 수영장, 한눈에 비교하고 바로 가자",
  description:
    "전국 2,000+ 수영장 정보를 한곳에서. 자유수영 시간표, 가격 비교, 안전등급까지 — 수영을 시작하는 가장 쉬운 방법.",
  keywords: [
    "수영장",
    "자유수영",
    "수영장 찾기",
    "내 주변 수영장",
    "수영장 가격",
    "실내수영장",
  ],
  openGraph: {
    title: "Blue Ocean — 내 근처 수영장, 한눈에 비교하고 바로 가자",
    description:
      "전국 2,000+ 수영장 정보를 한곳에서. 자유수영 시간표, 가격 비교, 안전등급까지.",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${outfit.variable} ${notoSansKR.variable} antialiased`}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
