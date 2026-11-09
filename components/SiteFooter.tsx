import Link from "next/link";

const linkClass =
  "inline-flex min-h-11 items-center px-1.5 underline-offset-4 hover:underline focus-visible:underline focus-visible:outline-none";

/** 하단 고지(필수) + 소개·방침 링크. 링크는 터치 영역 44px */
export function SiteFooter({ className = "" }: { className?: string }) {
  return (
    <footer
      className={`flex flex-wrap items-center justify-center text-xs text-cream/70 ${className}`}
    >
      <span className="px-1.5">재미로 보는 운세예요.</span>
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
