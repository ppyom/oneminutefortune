import { GUIDES, guidePath } from "@/lib/guides";

export const SITE_NAME = "One Minute Fortune";
export const MENU_NAME = "오늘의 운세";
export const SITE_DESCRIPTION =
  "생년월일만 넣으면 1분 만에 보는 오늘의 운세. 매일 자정에 바뀌어요.";

/** 배포 URL (끝 슬래시 없음). 미설정 시 로컬 개발 주소 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/+$/, "");

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || undefined;

/** 공개 페이지 (sitemap 대상) */
export const PUBLIC_ROUTES = [
  "/",
  "/guide",
  ...GUIDES.map((g) => guidePath(g.slug)),
  "/about",
  "/privacy",
];
