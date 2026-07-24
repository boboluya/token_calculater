import type { Metadata } from "next";
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_TITLE,
} from "@/lib/site";
import ChartsPageClient from "./ChartsPageClient";

/** 首页专属 meta：服务端渲染进 <head>，供 Googlebot 直接抓取 */
export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [...SITE_KEYWORDS],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    type: "website",
    locale: "zh_CN",
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function ChartsPage() {
  return <ChartsPageClient />;
}