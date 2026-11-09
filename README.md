# One Minute Fortune

생년월일만 넣으면 매일 바뀌는 **오늘의 운세**를 1분 안에 보고, 카드로 공유하는 모바일 우선 웹 서비스예요.

- 로그인·DB 없이 브라우저(localStorage)에만 저장
- 같은 생년월일·같은 날이면 언제 봐도 같은 결과 (KST 자정에 바뀜)
- 공유 링크(`/s/생년월일-날짜`)는 날짜가 지나도 그날 결과를 그대로 보여 줌

> 개발 규칙(운세 로직, 디자인 시스템, 카피 톤)은 [`CLAUDE.md`](./CLAUDE.md)에 정리돼 있어요. 코드를 고치기 전에 먼저 읽어 주세요.

## 기술 스택

| 영역       | 사용                                                   |
| ---------- | ------------------------------------------------------ |
| 프레임워크 | Next.js 16 (App Router, Cache Components) + TypeScript |
| 스타일     | Tailwind CSS v4 (디자인 토큰은 `app/globals.css`)      |
| 폰트       | SUITE(본문), Gowun Dodum(제목·숫자)                    |
| OG 이미지  | `next/og` (Satori)                                     |
| 공유       | Web Share API, 미지원 시 링크 복사                     |
| 분석·광고  | GA4(`@next/third-parties`), Google AdSense             |
| 테스트     | Vitest                                                 |
| 배포       | Vercel                                                 |

## 시작하기

Node.js 22 이상(개발은 24 기준)이 필요해요.

```bash
npm install
cp .env.example .env.local   # 값은 아래 "환경 변수" 참고, 비워 둬도 실행돼요
npm run dev                  # http://localhost:3000
```

## 명령어

| 명령                                     | 설명                              |
| ---------------------------------------- | --------------------------------- |
| `npm run dev`                            | 개발 서버                         |
| `npm run build` / `npm start`            | 프로덕션 빌드 / 실행              |
| `npm run lint`                           | ESLint                            |
| `npm run test`                           | Vitest (운세 결과 스냅샷 포함)    |
| `npm run format`                         | Prettier (+ Tailwind 클래스 정렬) |
| `npm run freeze-pool -- --from YYYYMMDD` | 문장풀 버전 고정 (아래 참고)      |

## 환경 변수

모두 선택이에요. 비워 두면 해당 기능만 꺼져요. `NEXT_PUBLIC_*`과 사이트 확인 값은 **빌드할 때 페이지에 들어가므로, Vercel에서 바꾸면 재배포**해야 해요.

| 변수                                                   | 용도                                                                     |
| ------------------------------------------------------ | ------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`                                 | 배포 URL(끝에 `/` 없이). sitemap·robots·OG 절대 경로                     |
| `NEXT_PUBLIC_GA_ID`                                    | GA4 측정 ID (`G-…`)                                                      |
| `GOOGLE_SITE_VERIFICATION` / `NAVER_SITE_VERIFICATION` | 검색엔진 소유 확인 meta 값                                               |
| `NEXT_PUBLIC_ADSENSE_CLIENT`                           | 애드센스 게시자 ID (`ca-pub-…`). 확인 스크립트·메타·`/ads.txt`·자동 광고 |
| `NEXT_PUBLIC_ADSENSE_SLOT_RESULT`                      | 결과 화면 디스플레이 광고 단위 ID (반응형 디스플레이 광고)               |

## 화면과 경로

| 경로                        | 내용                                                                        |
| --------------------------- | --------------------------------------------------------------------------- |
| `/`                         | 입력 화면 (생년월일·이름)                                                   |
| `/result`                   | 결과 화면 — 총운·분야별·행운, 공유·이미지 저장 (색인 안 함)                 |
| `/s/[생년월일-날짜]?n=이름` | 공유 랜딩. 미래 날짜는 404 (색인 안 함, 미리보기 봇은 허용)                 |
| `/api/og`                   | OG 이미지. 쿼리 없으면 공통, `?id=…&n=…`면 결과 포함 (이미지 저장에도 사용) |
| `/about`, `/privacy`        | 서비스 소개, 개인정보처리방침                                               |

## 폴더 구조

```
app/                 # 라우트 (page, result, s/[id], api/og, ads.txt, about, privacy, sitemap/robots/manifest)
components/          # 화면 컴포넌트 (result/, share/, AdSlot, SiteFooter …)
lib/fortune/         # 운세 핵심 로직 — seed(cyrb53·mulberry32), date(KST), getFortune(순수 함수)
lib/                 # birth·storage·share·adsense·inApp·luckyColors 유틸
data/fortune.json    # 문장풀
data/pool-versions.json  # 날짜별 칸당 사용 문장 수 (freeze-pool로만 추가)
assets/              # OG 이미지용 폰트(TTF)·미리 블러한 배경 PNG (public 아님)
design/              # 디자인 레퍼런스 HTML (구현 참고용)
scripts/             # freeze-pool, OG 배경 생성
```

## 운세 로직에서 꼭 지킬 것

- `getFortune(birth, date)`는 순수 함수예요. `Math.random()`·`Date.now()`를 쓰지 않아요. 화면과 OG 이미지가 같은 함수를 써서 결과가 항상 같아요.
- **이미 공유된 링크의 결과가 바뀌면 안 돼요.** 로직을 고치면 `npm run test`의 스냅샷으로 확인해요.

### 문장 추가 절차

1. `data/fortune.json`의 배열 **끝에만** 추가해요 (순서 변경·삭제 금지). Claude Code에서는 `add-fortune-lines` 스킬이 이 절차를 따라요.
2. `npm run freeze-pool -- --from YYYYMMDD`로 새 버전을 기록해요. `from`은 **내일(KST) 이후**만 돼요.
3. **`from` 날짜 전에 배포**해요. 그 이전 날짜의 결과는 바뀌지 않아요.
4. 행운의 색을 추가했다면 `lib/luckyColors.ts`에 HEX도 추가해요 (테스트가 빠진 색을 잡아요).

### OG 이미지 배경을 바꿀 때

Satori는 `backdrop-filter`를 지원하지 않아서, 결과 OG의 글래스 카드는 미리 블러한 배경 PNG 위에 그려요. 배경이나 카드 위치를 바꾸면 다시 생성해요.

```bash
node scripts/gen-og-backgrounds.mjs   # → assets/og/result-bg.png
```

## 배포 (Vercel)

1. Vercel 프로젝트에 위 환경 변수를 넣어요 (최소 `NEXT_PUBLIC_SITE_URL`).
2. main에 푸시하면 배포돼요. 환경 변수를 바꾼 뒤에는 재배포해요.
3. 공유 미리보기(카카오톡 등)는 `next.config.ts`의 `htmlLimitedBots`에 등록된 봇만 OG 태그를 `<head>`에서 받아요. 새 스크래퍼가 미리보기를 못 띄우면 여기에 추가해요.

## 개발 환경 메모

- **WSL에서 Windows 드라이브(`/mnt/c`, `/mnt/d`)에 저장소를 두면** 개발 서버가 파일 변경을 감지하지 못해요. 저장소를 WSL 파일시스템(`~/`)으로 옮기거나, 수정 후 `.next/dev`를 지우고 개발 서버를 다시 띄워요.
- 줄바꿈은 `.gitattributes`로 LF로 통일했어요.

## 라이선스

- 폰트: SUITE, Gowun Dodum — SIL Open Font License 1.1 (`assets/fonts/OFL-*.txt`)
- 운세 문장과 결과는 재미로 보는 콘텐츠예요.
