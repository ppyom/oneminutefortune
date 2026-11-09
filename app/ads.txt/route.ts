import { ADSENSE_CLIENT, adsTxt } from "@/lib/adsense";

// 게시자 ID가 없으면 404 (빌드 시점의 환경 변수로 정적 생성)
export function GET() {
  if (!ADSENSE_CLIENT) return new Response("Not Found", { status: 404 });
  return new Response(adsTxt(ADSENSE_CLIENT), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
