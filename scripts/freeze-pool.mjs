// 문장풀 버전 고정 스크립트
//
// data/fortune.json 의 현재 칸별 문장 수를 data/pool-versions.json 에 새 버전으로 기록한다.
// getFortune 은 날짜별로 유효한 버전의 개수만 후보로 쓰므로, `from` 이전 날짜의 결과는
// 문장을 추가해도 절대 바뀌지 않는다.
//
// 사용:
//   node scripts/freeze-pool.mjs --from YYYYMMDD [--dry-run]
//
// 규칙:
//   - from 은 오늘(KST)보다 뒤여야 한다. 오늘 이미 본 결과가 바뀌면 안 되기 때문.
//     (버전 파일이 비어 있을 때만 예외)
//   - from 날짜 전에 배포해야 한다. 배포가 늦으면 그 사이 날짜의 결과가 바뀐다.
//   - 개수가 줄어든 칸이 있으면 거부한다 (문장 삭제 금지).
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const POOL_PATH = "data/fortune.json";
const VERSIONS_PATH = "data/pool-versions.json";
const GRADES = ["best", "good", "normal", "caution"];
const FIELDS = ["love", "money", "work", "health"];
const LUCKY_LISTS = ["color", "direction", "item"];

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const fromIdx = args.indexOf("--from");
const from = fromIdx >= 0 ? args[fromIdx + 1] : undefined;

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

function isValidYmd(s) {
  if (!/^\d{8}$/.test(s ?? "")) return false;
  const y = +s.slice(0, 4),
    m = +s.slice(4, 6),
    d = +s.slice(6, 8);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return (
    dt.getUTCFullYear() === y &&
    dt.getUTCMonth() === m - 1 &&
    dt.getUTCDate() === d
  );
}

function todayKst() {
  const k = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return `${k.getUTCFullYear()}${String(k.getUTCMonth() + 1).padStart(2, "0")}${String(k.getUTCDate()).padStart(2, "0")}`;
}

if (!isValidYmd(from))
  fail("--from YYYYMMDD 를 지정해 주세요. 예: --from 20261201");

const pool = JSON.parse(readFileSync(POOL_PATH, "utf8"));
const versions = existsSync(VERSIONS_PATH)
  ? JSON.parse(readFileSync(VERSIONS_PATH, "utf8"))
  : [];

const counts = {};
for (const g of GRADES) {
  counts[`total.${g}.summary`] = pool.total[g].summary.length;
  counts[`total.${g}.detail`] = pool.total[g].detail.length;
}
for (const f of FIELDS)
  for (const g of GRADES) counts[`${f}.${g}`] = pool[f][g].length;
for (const k of LUCKY_LISTS) counts[`lucky.${k}`] = pool.lucky[k].length;

const last = versions.at(-1);
if (last) {
  const today = todayKst();
  if (from <= today)
    fail(
      `from(${from})은 오늘(KST ${today})보다 뒤여야 해요. 오늘 결과가 바뀌면 안 돼요.`,
    );
  if (from <= last.from)
    fail(`from(${from})이 마지막 버전(${last.from})보다 뒤여야 해요.`);

  const shrunk = Object.keys(last.counts).filter(
    (k) => (counts[k] ?? 0) < last.counts[k],
  );
  if (shrunk.length)
    fail(
      `문장 수가 줄어든 칸: ${shrunk.join(", ")} — 기존 문장은 삭제할 수 없어요.`,
    );

  const changed = Object.keys(counts).filter(
    (k) => counts[k] !== last.counts[k],
  );
  if (!changed.length) {
    console.log("변경된 칸이 없어 새 버전을 만들지 않았어요.");
    process.exit(0);
  }
  console.log(`버전 ${from} — 변경된 칸 ${changed.length}개`);
  for (const k of changed)
    console.log(`  ${k}: ${last.counts[k] ?? 0} → ${counts[k]}`);
} else {
  console.log(`첫 버전 ${from} 생성`);
}

if (dryRun) {
  console.log("(dry-run: 파일을 쓰지 않았어요)");
  process.exit(0);
}

versions.push({ from, counts });
writeFileSync(VERSIONS_PATH, JSON.stringify(versions, null, 2) + "\n");
console.log(`✓ ${VERSIONS_PATH} 갱신. from 날짜 전에 배포해 주세요.`);
