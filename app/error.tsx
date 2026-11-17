"use client";

import { useEffect } from "react";
import { secondaryButton, StatusPage } from "@/components/StatusPage";
import { SITE_NAME } from "@/lib/site";

export default function ErrorPage({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      {/* 에러 경계는 클라이언트라 metadata를 못 내보낸다 → React가 head로 올려 준다 */}
      <title>{`문제가 생겼어요 | ${SITE_NAME}`}</title>
      <meta name="robots" content="noindex" />
      <StatusPage
        label="잠시 문제가 생겼어요"
        title={
          <>
            별빛이 잠깐
            <br />
            흐려졌어요
          </>
        }
        description="화면을 불러오다 문제가 생겼어요. 다시 시도하거나 처음부터 운세를 볼 수 있어요."
        actions={
          <button
            type="button"
            onClick={() => retry()}
            className={secondaryButton}
          >
            다시 시도
          </button>
        }
      />
    </>
  );
}
