import type { NextConfig } from "next";
import { HTML_LIMITED_BOT_UA_RE_STRING } from "next/dist/shared/lib/router/utils/is-bot";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  // 이 봇들에는 메타데이터를 스트리밍하지 않고 <head>에 먼저 넣는다.
  // Next 기본 목록에 카카오톡 미리보기 스크래퍼 등이 없어, 그대로 두면 OG 태그가
  // </head> 뒤로 밀려 카톡 미리보기가 깨질 수 있다.
  htmlLimitedBots: new RegExp(
    `${HTML_LIMITED_BOT_UA_RE_STRING}|kakaotalk|Daum|TelegramBot|Pinterest|Embedly|Iframely`,
    "i",
  ),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
