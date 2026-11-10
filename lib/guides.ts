/** 운세 가이드 글 목록. 가이드 목차·하단 링크·sitemap이 함께 쓴다. */
export const GUIDES = [
  {
    slug: "grades",
    title: "운세 등급 읽는 법",
    description:
      "최고·좋음·보통·주의, 네 가지 등급이 뜻하는 것과 하루를 보내는 팁",
  },
  {
    slug: "fields",
    title: "분야별 운세와 별점 보는 법",
    description: "애정·금전·일·건강운의 별점 1–5개를 어떻게 읽으면 좋은지",
  },
  {
    slug: "lucky-color",
    title: "행운의 색 20가지 의미",
    description: "라벤더부터 화이트까지, 오늘의 행운의 색을 활용하는 방법",
  },
  {
    slug: "lucky-signs",
    title: "행운의 숫자·방위·아이템 활용법",
    description:
      "숫자 1–99, 여덟 방위, 생활 속 행운의 아이템을 가볍게 즐기는 방법",
  },
] as const;

export type GuideSlug = (typeof GUIDES)[number]["slug"];

/**
 * 가이드 경로를 만든다.
 * @param slug 가이드 슬러그
 * @returns `/guide/<slug>`
 */
export function guidePath(slug: GuideSlug): string {
  return `/guide/${slug}`;
}
