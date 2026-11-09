// 문장풀 현황·검증 스크립트
// 사용: node .claude/skills/add-fortune-lines/scripts/check-pool.mjs [경로]
import { readFileSync } from "node:fs";

const path = process.argv[2] ?? "data/fortune.json";
const MIN = 20;
const GRADES = ["best", "good", "normal", "caution"];
const FIELDS = ["love", "money", "work", "health"];

let pool;
try {
  pool = JSON.parse(readFileSync(path, "utf8"));
} catch (e) {
  console.error(`✗ ${path} 를 읽거나 파싱할 수 없음: ${e.message}`);
  process.exit(1);
}

const rows = [];
const errors = [];
const seen = new Map();

function check(label, arr) {
  if (!Array.isArray(arr)) {
    errors.push(`${label}: 배열이 아님`);
    return;
  }
  arr.forEach((s, i) => {
    if (typeof s !== "string" || !s.trim()) {
      errors.push(`${label}[${i}]: 빈 값 또는 문자열 아님`);
      return;
    }
    const key = s.trim();
    if (seen.has(key)) errors.push(`${label}[${i}]: 중복 (${seen.get(key)}와 같음) "${key}"`);
    else seen.set(key, `${label}[${i}]`);
  });
  rows.push({ label, count: arr.length, low: arr.length < MIN });
}

for (const g of GRADES) {
  check(`total.${g}.summary`, pool.total?.[g]?.summary);
  check(`total.${g}.detail`, pool.total?.[g]?.detail);
}
for (const f of FIELDS) for (const g of GRADES) check(`${f}.${g}`, pool[f]?.[g]);
for (const k of ["color", "item", "direction"]) {
  const arr = pool.lucky?.[k];
  if (!Array.isArray(arr)) errors.push(`lucky.${k}: 배열이 아님`);
  else rows.push({ label: `lucky.${k}`, count: arr.length, low: false });
}

const width = Math.max(...rows.map((r) => r.label.length));
console.log("칸".padEnd(width), "문장 수");
for (const r of rows) console.log(r.label.padEnd(width), String(r.count).padStart(4), r.low ? `  ← ${MIN}개 미만` : "");
console.log(`\n총 ${rows.reduce((a, r) => a + r.count, 0)}개 · ${MIN}개 미만 칸 ${rows.filter((r) => r.low).length}개`);

if (errors.length) {
  console.error(`\n✗ 오류 ${errors.length}건`);
  errors.forEach((e) => console.error("  - " + e));
  process.exit(1);
}
console.log("✓ 중복·형식 오류 없음");
