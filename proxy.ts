import { type NextRequest, NextResponse } from "next/server";
import { todayKst } from "@/lib/fortune/date";
import { parseShareTarget } from "@/lib/share";

/*
 * 공유 랜딩(/s/[id])은 Partial Prerender라 일반 브라우저에는 정적 셸이 200으로 먼저 나간다.
 * 페이지 안의 notFound()로는 상태 코드를 바꿀 수 없어, 렌더링 전에 여기서 걸러 404를 낸다.
 */
export function proxy(request: NextRequest) {
  const id = request.nextUrl.pathname.slice("/s/".length);
  if (parseShareTarget(id, todayKst())) return NextResponse.next();
  // /_not-found로 rewrite하면 Vercel은 정적 페이지로 보고 200을 낸다.
  // 어떤 라우트에도 없는 경로로 보내야 not-found 화면이 404로 나간다.
  return NextResponse.rewrite(new URL(INVALID_SHARE_PATH, request.url));
}

const INVALID_SHARE_PATH = "/__invalid-share";

export const config = {
  matcher: "/s/:id",
};
