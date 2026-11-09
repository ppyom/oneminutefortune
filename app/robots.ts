import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /s/(공유 랜딩)와 /api/og는 막지 않는다. 카톡 등 미리보기 봇이 읽어야 하고,
      // 색인은 페이지의 noindex 메타와 OG 이미지의 X-Robots-Tag로 막는다.
      disallow: ["/result"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
