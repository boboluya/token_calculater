import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl().origin;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // 内部 API / 同步端点无需被索引
      disallow: ["/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}