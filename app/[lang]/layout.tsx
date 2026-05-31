import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { locales, isLocale, htmlLang, ogLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const SITE = {
  ko: {
    title: "STARFOLIO — 주식 리서치",
    description: "개인 주식 리서치 · 거래일지 대시보드. 코스피/코스닥 종목 리서치, 주도주, 테마 분석, 신고가 스크리너, 공시 추적.",
  },
  en: {
    title: "STARFOLIO — Korean Stock Research",
    description: "Personal Korean-equity (KOSPI/KOSDAQ) research dashboard — leading stocks, sector themes, new-high screener, and disclosure tracking.",
  },
} as const;

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const loc: Locale = isLocale(lang) ? lang : "ko";
  const s = SITE[loc];
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: s.title, template: "%s · STARFOLIO" },
    description: s.description,
    applicationName: SITE_NAME,
    keywords: ["Korean stocks", "KOSPI", "KOSDAQ", "stock research", "leading stocks", "주식 리서치", "주도주", "종목 분석"],
    alternates: {
      canonical: `/${loc}`,
      languages: { ko: "/ko", en: "/en", "x-default": "/ko" },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: s.title,
      description: s.description,
      url: `${SITE_URL}/${loc}`,
      locale: ogLocale[loc],
      alternateLocale: loc === "ko" ? ["en_US"] : ["ko_KR"],
    },
    twitter: { card: "summary_large_image", title: s.title, description: s.description },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  };
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return (
    <html lang={htmlLang[lang]} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css" />
        <div className="flex min-h-screen">
          <Sidebar locale={lang} labels={dict.nav} />
          <div className="flex-1 flex flex-col min-w-0 md:pl-[84px]">
            <Topbar locale={lang} searchPlaceholder={dict.topbar.searchPlaceholder} marketOpen={dict.topbar.marketOpen} />
            <main className="flex-1 px-4 md:px-10 py-8 pb-24 md:pb-10 max-w-[1320px] w-full mx-auto">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
