/**
 * 행운의 색 견본용 대응표 (이름 → HEX).
 * UI 4색 규칙의 예외: 운세 내용으로서의 색이라 실제 색을 보여 준다.
 * data/fortune.json의 lucky.color에 색을 추가하면 여기에도 반드시 추가한다
 * (lib/luckyColors.test.ts가 빠진 색을 잡는다).
 */
export const LUCKY_COLOR_HEX: Readonly<Record<string, string>> = {
  라벤더: "#B9A7D9",
  실버: "#C9CDD6",
  크림: "#F3E9C6",
  골드: "#D4AF37",
  네이비: "#1F2A5A",
  민트: "#A8E6CF",
  코랄: "#FF7F6E",
  버건디: "#800020",
  하늘색: "#9CCFF0",
  연두색: "#B5D96B",
  베이지: "#E3D3B4",
  레몬색: "#F5E663",
  아이보리: "#FFFDF0",
  진주색: "#EDE7DC",
  올리브: "#808A3C",
  피치: "#FFC8A2",
  차콜: "#3C3C44",
  청록색: "#2A9D8F",
  살구색: "#F8B88B",
  화이트: "#FFFFFF",
};

/** 대응표에 없으면 undefined → 견본 없이 이름만 표시 */
export function luckyColorHex(name: string): string | undefined {
  return LUCKY_COLOR_HEX[name];
}
