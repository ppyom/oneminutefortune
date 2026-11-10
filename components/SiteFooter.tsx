import Link from "next/link";

const linkClass =
  "inline-flex min-h-11 items-center px-1.5 underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none";

/**
 * 하단 고지(필수) + 소개·방침 링크. 링크는 터치 영역 44px.
 * 화면에 고지 문구가 따로 있으면 notice={false}로 링크만 보여 준다.
 */
export function SiteFooter({
  className = "",
  notice = true,
}: {
  className?: string;
  notice?: boolean;
}) {
  return (
    <footer
      className={`flex flex-wrap items-center justify-center text-xs text-cream/70 ${className}`}
    >
      {notice && (
        <>
          <span className="px-1.5">재미로 보는 운세예요.</span>
          <span aria-hidden>·</span>
        </>
      )}
      <Link href="/guide" className={linkClass}>
        운세 가이드
      </Link>
      <span aria-hidden>·</span>
      <Link href="/about" className={linkClass}>
        서비스 소개
      </Link>
      <span aria-hidden>·</span>
      <Link href="/privacy" className={linkClass}>
        개인정보처리방침
      </Link>
    </footer>
  );
}
