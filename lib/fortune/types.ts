export const GRADES = ["best", "good", "normal", "caution"] as const;
export type Grade = (typeof GRADES)[number];

export const GRADE_LABEL: Record<Grade, string> = {
  best: "최고",
  good: "좋음",
  normal: "보통",
  caution: "주의",
};

export const FIELDS = ["love", "money", "work", "health"] as const;
export type Field = (typeof FIELDS)[number];

export const LUCKY_LISTS = ["color", "direction", "item"] as const;
export type LuckyList = (typeof LUCKY_LISTS)[number];

/** `YYYYMMDD` 형식 문자열 */
export type Ymd = string;

/** data/fortune.json 구조 */
export interface FortunePool {
  total: Record<Grade, { summary: string[]; detail: string[] }>;
  love: Record<Grade, string[]>;
  money: Record<Grade, string[]>;
  work: Record<Grade, string[]>;
  health: Record<Grade, string[]>;
  lucky: {
    color: string[];
    /** [최소, 최대] 범위. 바꾸면 기존 결과가 달라진다. */
    number: [number, number];
    direction: string[];
    item: string[];
  };
}

/**
 * data/pool-versions.json 의 한 항목.
 * `from` 날짜(KST)부터 각 칸에서 앞쪽 `counts[칸]`개 문장만 후보로 쓴다.
 * 칸 키 예: "total.best.summary", "love.caution", "lucky.color"
 */
export interface PoolVersion {
  from: Ymd;
  counts: Record<string, number>;
}

export interface FieldFortune {
  score: number;
  grade: Grade;
  /** 1–5 */
  stars: number;
  text: string;
}

export interface Fortune {
  birth: Ymd;
  date: Ymd;
  total: {
    score: number;
    grade: Grade;
    summary: string;
    detail: string;
  };
  fields: Record<Field, FieldFortune>;
  lucky: {
    color: string;
    number: number;
    direction: string;
    item: string;
  };
}
