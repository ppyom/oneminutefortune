import { GUIDES, guidePath } from "@/lib/guides";

export const SITE_NAME = "One Minute Fortune";
export const MENU_NAME = "오늘의 운세";
export const SITE_DESCRIPTION =
  "생년월일만 넣으면 1분 만에 보는 오늘의 운세. 매일 자정에 바뀌어요.";

/** 홈 title — 검색어("오늘의 운세")와 맞추려고 한글 키워드를 앞에 둔다 */
export const HOME_TITLE = `${MENU_NAME} – 생년월일로 1분 무료 운세 | ${SITE_NAME}`;

/** 실제 제공하는 내용만 넣는다 (띠·별자리 등 미제공 메뉴 제외) */
export const SITE_KEYWORDS = [
  "오늘의 운세",
  "오늘 운세",
  "무료 운세",
  "생년월일 운세",
  "일일 운세",
  "행운의 색",
  "행운의 숫자",
];

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
