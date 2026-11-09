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

const num = pool.lucky?.number;
if (!Array.isArray(num) || num.length !== 2 || num[0] !== 1 || num[1] !== 99)
  errors.push(`lucky.number: [1, 99]여야 함 (현재 ${JSON.stringify(num)}) — 바꾸면 기존 결과가 달라짐`);

// pool-versions.json 대비 고정(freeze) 현황
const versionsPath = path.replace(/fortune\.json$/, "pool-versions.json");
let frozen = null;
try {
  frozen = JSON.parse(readFileSync(versionsPath, "utf8")).at(-1) ?? null;
} catch {
  // 버전 파일이 없으면 고정 현황은 생략
}
for (const r of rows) {
  r.frozen = frozen?.counts?.[r.label];
  if (r.frozen != null && r.count < r.frozen)
    errors.push(`${r.label}: 고정된 ${r.frozen}개보다 적음 (${r.count}개) — 문장이 삭제됨`);
}

const width = Math.max(...rows.map((r) => r.label.length));
console.log("칸".padEnd(width), "문장 수", frozen ? " 고정" : "");
for (const r of rows) {
  const notes = [];
  if (r.low) notes.push(`${MIN}개 미만`);
  if (frozen && r.frozen !== r.count) notes.push("freeze 안 됨");
  console.log(
    r.label.padEnd(width),
    String(r.count).padStart(4),
    frozen ? String(r.frozen ?? "-").padStart(7) : "",
    notes.length ? `  ← ${notes.join(", ")}` : "",
  );
}
console.log(`\n총 ${rows.reduce((a, r) => a + r.count, 0)}개 · ${MIN}개 미만 칸 ${rows.filter((r) => r.low).length}개`);
if (frozen) {
  const pending = rows.filter((r) => r.frozen !== r.count).length;
  console.log(
    pending
      ? `마지막 버전(from ${frozen.from}) 이후 freeze 안 된 칸 ${pending}개 — 추가한 문장은 freeze 전까지 화면에 안 나와요`
      : `모든 칸이 마지막 버전(from ${frozen.from})에 고정돼 있어요`,
  );
}

if (errors.length) {
  console.error(`\n✗ 오류 ${errors.length}건`);
  errors.forEach((e) => console.error("  - " + e));
  process.exit(1);
}
console.log("✓ 중복·형식 오류 없음");
