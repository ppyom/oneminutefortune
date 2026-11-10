import pool from "@/data/fortune.json";

/*
 * 운세 가이드에 쓰는 행운 항목 설명. 문장풀(data/fortune.json)에 색·방위를 추가하면
 * 여기에도 추가한다 (lib/luckyGuide.test.ts가 빠진 항목을 잡는다).
 */

export const LUCKY_COLOR_MEANING: Readonly<Record<string, string>> = {
  라벤더: "마음을 차분하게 가라앉혀 줘요. 생각이 많은 날 곁에 두면 좋아요.",
  실버: "깔끔하고 이성적인 느낌을 줘요. 정리하고 판단할 일이 있는 날에 어울려요.",
  크림: "부드럽고 편안한 인상을 줘요. 처음 만나는 사람과의 자리에 잘 맞아요.",
  골드: "자신감과 활기를 상징해요. 발표나 중요한 약속이 있는 날 포인트로 써 보세요.",
  네이비: "믿음직하고 단정한 느낌이에요. 신뢰가 필요한 자리에서 힘이 돼요.",
  민트: "산뜻한 새 출발을 떠올리게 해요. 기분 전환이 필요한 날 잘 어울려요.",
  코랄: "따뜻하고 다정한 에너지를 줘요. 사람을 만나는 날 생기를 더해 줘요.",
  버건디: "깊이 있고 성숙한 분위기예요. 차분하게 집중하고 싶은 날에 좋아요.",
  하늘색: "시원하고 열린 마음을 상징해요. 대화가 많은 날 부담을 덜어 줘요.",
  연두색:
    "새싹처럼 성장과 회복을 떠올리게 해요. 새로운 걸 배우는 날에 어울려요.",
  베이지:
    "무난하고 안정적인 색이에요. 평소 리듬을 지키고 싶은 날 편안함을 줘요.",
  레몬색: "밝고 경쾌한 기분을 끌어올려요. 가라앉은 날 작은 포인트로 써 보세요.",
  아이보리:
    "깨끗하고 포근한 느낌이에요. 마음을 비우고 시작하고 싶은 날에 좋아요.",
  진주색:
    "은은한 우아함을 상징해요. 조용히 존재감을 드러내고 싶은 날 어울려요.",
  올리브:
    "자연스럽고 여유로운 분위기예요. 서두르지 않고 천천히 가는 날에 맞아요.",
  피치: "사랑스럽고 부드러운 인상을 줘요. 고마운 마음을 전하는 날 잘 어울려요.",
  차콜: "묵직하고 단단한 느낌이에요. 흔들리지 않고 내 할 일에 집중하게 도와줘요.",
  청록색: "균형과 맑은 정신을 상징해요. 복잡한 문제를 풀어야 하는 날에 좋아요.",
  살구색:
    "온화하고 친근한 분위기를 만들어요. 모임이나 가족과 보내는 날에 어울려요.",
  화이트: "새로움과 깨끗함을 상징해요. 무언가를 처음 시작하는 날 잘 맞아요.",
};

export const LUCKY_DIRECTION_TIP: Readonly<Record<string, string>> = {
  동: "해가 뜨는 쪽이에요. 새로 시작하는 일과 잘 어울려요.",
  남서: "포근한 오후의 방향이에요. 사람들과 어울리는 시간에 좋아요.",
  북: "차분하고 고요한 방향이에요. 혼자 집중하는 일에 어울려요.",
  서: "하루를 마무리하는 방향이에요. 정리하고 매듭짓는 일에 좋아요.",
  남: "햇볕이 가장 오래 드는 쪽이에요. 활기가 필요한 날 어울려요.",
  남동: "따뜻한 아침 햇살의 방향이에요. 대화와 연락을 시작하기 좋아요.",
  북동: "새벽의 방향이에요. 계획을 세우고 마음을 다잡는 일에 맞아요.",
  북서: "해 질 녘의 방향이에요. 오늘을 돌아보고 쉬어 가는 시간에 좋아요.",
};

/**
 * 문장풀 순서대로 행운의 색과 설명을 돌려준다. 설명이 없는 색은 뺀다.
 * @returns { name, text } 목록
 */
export function luckyColorGuide(): { name: string; text: string }[] {
  return withText(pool.lucky.color, LUCKY_COLOR_MEANING);
}

/**
 * 문장풀 순서대로 행운의 방위와 설명을 돌려준다. 설명이 없는 방위는 뺀다.
 * @returns { name, text } 목록
 */
export function luckyDirectionGuide(): { name: string; text: string }[] {
  return withText(pool.lucky.direction, LUCKY_DIRECTION_TIP);
}

/** 문장풀의 행운의 아이템 전체 */
export const LUCKY_ITEMS: readonly string[] = pool.lucky.item;

function withText(names: string[], table: Readonly<Record<string, string>>) {
  return names.flatMap((name) =>
    table[name] ? [{ name, text: table[name] }] : [],
  );
}
