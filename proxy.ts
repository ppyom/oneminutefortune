import { type NextRequest, NextResponse } from "next/server";
import { todayKst } from "@/lib/fortune/date";
import { parseShareTarget } from "@/lib/share";

/*
 * 공유 랜딩(/s/[id])은 Partial Prerender라 일반 브라우저에는 정적 셸이 200으로 먼저 나간다.
 * 페이지 안의 notFound()로는 상태 코드를 바꿀 수 없어, 렌더링 전에 여기서 걸러 404를 낸다.
 */
export async function proxy(request: NextRequest) {
  const id = request.nextUrl.pathname.slice("/s/".length);
  if (parseShareTarget(id, todayKst())) return NextResponse.next();
  // 클라이언트 내비게이션은 상태 코드와 무관하므로 not-found 페이로드만 넘긴다
  if (request.headers.has("rsc")) {
    return NextResponse.rewrite(new URL(NOT_FOUND_PATH, request.url));
  }
  return notFoundResponse(request);
}

// 어떤 라우트에도 없는 경로 → not-found 화면
const NOT_FOUND_PATH = "/__invalid-share";

/*
 * rewrite는 Vercel에서 /_not-found 정적 페이지(200)로 처리되고 상태 코드 지정도 먹지 않는다.
 * 그래서 not-found 화면 HTML을 받아 와 404로 직접 응답한다.
 */
async function notFoundResponse(request: NextRequest): Promise<NextResponse> {
  try {
    const res = await fetch(new URL(NOT_FOUND_PATH, request.url));
    return new NextResponse(res.body, {
      status: 404,
      headers: {
        "content-type":
          res.headers.get("content-type") ?? "text/html; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  } catch {
    return new NextResponse("Not Found", { status: 404 });
  }
}

export const config = {
  matcher: "/s/:id",
};
