import type { Metadata } from "next";
import { ResultBackdrop } from "@/components/result/ResultBackdrop";
import { ResultView } from "@/components/result/ResultView";

export const metadata: Metadata = {
  title: "오늘의 운세",
  // 개인 결과라 색인하지 않는다 (robots.txt에서도 /result 차단)
  robots: { index: false, follow: false },
};

export default function ResultPage() {
  return (
    <div className="relative isolate flex min-h-dvh flex-col overflow-hidden px-5 pt-6 pb-10 tablet:px-12 tablet:pt-8 tablet:pb-12 desktop:px-30 desktop:pb-14">
      <ResultBackdrop />
      <ResultView />
    </div>
  );
}
