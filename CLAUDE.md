# One Minute Fortune

생년월일만 넣으면 매일 바뀌는 오늘의 운세를 1분 안에 보고 카드로 공유하는 모바일 우선 웹 서비스.
1인 개발 프로젝트. MVP 범위는 "입력 → 결과 → 공유" 한 바퀴.

## 기술 스택

- Next.js (App Router) + TypeScript + Tailwind CSS
- 배포: Vercel
- 저장: localStorage만 사용 (DB, 로그인 없음)
- 공유 이미지: `next/og` (ImageResponse)
- 이미지 저장: OG 결과 이미지(`/api/og?id=…`)를 내려받는다 (html-to-image는 backdrop-filter를 못 그려 쓰지 않음)
- 공유: Web Share API(`navigator.share`), 미지원 브라우저는 링크 복사(`navigator.clipboard`)로 대체
- 분석: GA4 (`@next/third-parties`, `NEXT_PUBLIC_GA_ID` 있을 때만)
- 테스트: Vitest

## 명령어

```bash
npm run dev       # 개발 서버
npm run build     # 프로덕션 빌드
npm run lint      # ESLint
npm run test      # Vitest
npm run format    # Prettier (+ tailwind 클래스 정렬)
npm run freeze-pool -- --from YYYYMMDD   # 문장풀 버전 고정 (add-fortune-lines 스킬 참고)
```

## 폴더 구조

```
app/
  page.tsx              # 입력 화면 (/)
  result/page.tsx       # 결과 화면 (/result)
  s/[id]/page.tsx       # 공유 랜딩 (/s/[생년월일-날짜])
  api/og/route.tsx      # OG 이미지 (공통 + 결과 포함)
  about/page.tsx        # 서비스 소개
  privacy/page.tsx      # 개인정보처리방침
  sitemap.ts, robots.ts, manifest.ts
lib/site.ts             # 사이트 URL·이름 상수 (env: .env.example 참고)
lib/fortune/
  seed.ts               # 해시(cyrb53), PRNG(mulberry32)
  getFortune.ts         # 핵심 순수 함수
  date.ts               # KST 기준 날짜 유틸
  types.ts
data/
  fortune.json          # 문장풀
  pool-versions.json    # 날짜별 칸당 사용 문장 수 (freeze-pool로만 추가)
scripts/
  freeze-pool.mjs       # pool-versions에 새 버전 기록
components/
public/fonts/           # SUITE woff2
```

## 운세 로직 — 반드시 지킬 것

- `getFortune(birth: string, date: string)`는 **순수 함수**. 같은 입력이면 항상 같은 결과. `Math.random()`, `Date.now()` 사용 금지.
- 시드 = `YYYYMMDD(생년월일) + YYYYMMDD(오늘)` → cyrb53 해시 → mulberry32.
- 항목별로 salt(`total`, `love`, `money`, `work`, `health`, `lucky`)를 붙여 시드를 분리한다.
- 날짜는 **항상 KST(Asia/Seoul) 기준**. 클라이언트 시간대 무시. 자정에 바뀐다.
- 클라이언트 화면과 서버 OG 이미지가 같은 함수를 써서 결과가 반드시 일치해야 한다.
- 로직 변경 시 기존 결과가 바뀌는지 스냅샷 테스트로 확인한다. 이미 공유된 링크의 결과가 바뀌면 안 된다.

### 점수 → 등급

| 점수 | 등급 키 | 표시 |
| --- | --- | --- |
| 85–100 | `best` | 최고 |
| 65–84 | `good` | 좋음 |
| 40–64 | `normal` | 보통 |
| 0–39 | `caution` | 주의 |

- `caution`은 약 15% 비율로 나오게 분포를 조정한다. 문장은 조언형으로 쓴다.
- 분야별 운세는 별점 1–5로 표시한다.

### 문장풀 (`data/fortune.json`)

- 구조: `{ total: { [grade]: { summary[], detail[] } }, love|money|work|health: { [grade]: string[] }, lucky: { color[], number, direction[], item[] } }`
- 칸당 최소 20문장을 유지한다.
- 문장 순서를 바꾸거나 중간에서 삭제하지 말 것. 인덱스가 바뀌면 기존 결과가 달라진다. 추가는 배열 끝에만 한다.
- 선택은 `floor(rng() * counts[칸])`. `counts`는 `data/pool-versions.json`에서 그 날짜에 유효한 버전의 값이다. `arr.length`나 `% length`로 고르지 말 것.
- 추가한 문장은 `freeze-pool`로 새 버전(`from` = 내일 이후)을 기록해야 쓰인다. `from` 이전 날짜의 결과는 바뀌지 않는다. `from` 날짜 전에 배포한다.
- `lucky.number` 범위 `[1, 99]`는 바꾸지 않는다.

## 디자인 시스템

### 컬러 (이 4개 외 임의 색 추가 금지)

| 토큰 | 값 | 용도 |
| --- | --- | --- |
| `night` | `#290044` | 페이지 배경 |
| `violet` | `#500071` | 카드 틴트, 보조 면 |
| `plum` | `#8A2A78` | 배경 행성, 테두리, 꺼진 별 |
| `cream` | `#EEE3B0` | 텍스트, 주요 버튼, 달 |

- 보조 텍스트: `cream` 70–88% 불투명도
- 주요 버튼: `cream` 배경 + `night` 텍스트
- 보조 버튼: 투명 배경 + `plum` 1.5px 테두리
- 예외: 행운의 색 견본은 운세 내용이라 실제 색을 쓴다. `lib/luckyColors.ts` 대응표만 사용하고 UI 다른 곳에는 쓰지 않는다.

### 리퀴드 글래스 카드

```css
background: rgba(80, 0, 113, 0.32);
backdrop-filter: blur(24px) saturate(160%);
border: 1px solid rgba(238, 227, 176, 0.2);
box-shadow: inset 0 1px 0 rgba(238, 227, 176, 0.28), 0 12px 40px rgba(20, 0, 34, 0.45);
```

- 작은 카드: blur 20px, 테두리 0.18
- 글래스가 보이도록 카드 뒤에 `plum` 원형 행성을 배경으로 깐다.
- 글씨 뒤에 `cream` 달·행성이 오지 않게 배치한다 (가독성).

### 폰트

- 본문: **SUITE** (400/500/600) — `next/font/local`, `public/fonts`
- 제목·로고·점수 숫자: **Gowun Dodum** (400만 존재) — `next/font/google`
- Gowun Dodum에 `font-bold` 쓰지 말 것 (가짜 볼드).

### 레이아웃

- 브레이크포인트: 모바일 ~767 / 태블릿 768–1199 / 데스크톱 1200+
- 모바일 기준 디자인 폭 390, 카드 radius 20–28px
- 터치 영역 최소 44px
- 데스크톱 입력·공유 화면: 좌측 카피 + 우측 글래스 카드 2단
- 데스크톱 결과 화면: 좌측 총운 카드 + 공유 버튼 / 우측 분야별·행운·광고

## OG 이미지

- A. 공통: 날짜 없음, 메인 링크용
- B. 결과 포함: `/s/[생년월일-날짜]?n=이름`(이름은 입력한 경우만) 공유 링크용. 미래 날짜는 404. URL에 날짜가 꼭 있어야 카톡 캐시를 피할 수 있다.
- Satori는 `backdrop-filter` 미지원. 글래스는 미리 블러 처리한 배경 PNG로 흉내 낸다 (`scripts/gen-og-backgrounds.mjs` → `assets/og/`, 폰트는 `assets/fonts/` 정적 TTF).
- `/s/`와 `/api/og`는 robots.txt로 막지 않는다 (미리보기 봇이 읽어야 함). 색인은 noindex로 막는다. 카카오 등 봇 목록은 `next.config.ts`의 `htmlLimitedBots`.
- 1200×630.

## 카피 톤

- 반말이 아닌 부드러운 해요체. 짧은 문장.
- 서비스명: One Minute Fortune / 메뉴명: 오늘의 운세
- 하단 고지 필수: "재미로 보는 운세예요."

## 하지 말 것

- 로그인, DB, 서버 상태 추가 (MVP 범위 밖)
- 운세 생성에 LLM 호출 (MVP는 문장풀만)
- 이모지 아이콘 사용. 아이콘은 인라인 SVG 사용
- 그라데이션 워시 배경
- Kakao JS SDK 등 외부 공유 SDK 추가. 공유는 Web Share API + 링크 복사만 쓴다

## 이후 로드맵 (지금 구현 X)

궁합·내일 운세 → 스트릭·PWA 알림 → LLM 유료 상세 풀이 → 별자리·타로 등 메뉴 확장