import type { Metadata } from "next";
import { StatusPage } from "@/components/StatusPage";

// noindex는 Next가 not-found 화면에 자동으로 넣는다 (스트리밍 뒤 200으로 나가는 경우 포함)
export const metadata: Metadata = {
  title: "페이지를 찾을 수 없어요",
};

export default function NotFound() {
  return (
    <StatusPage
      label="404"
      title={
        <>
          이 운세는
          <br />
          아직 찾을 수 없어요
        </>
      }
      description="주소가 잘못됐거나 아직 오지 않은 날의 운세예요. 오늘의 운세는 지금 바로 볼 수 있어요."
    />
  );
}
