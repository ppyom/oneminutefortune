#!/usr/bin/env bash
# Stop hook: 작업이 끝날 때 lint + test를 돌린다.
# 실패하면 exit 2로 결과를 Claude에게 돌려 고치게 한다.
# 이미 hook 때문에 이어서 작업 중이면(stop_hook_active) 다시 막지 않는다(무한 반복 방지).
input=$(cat)
if printf '%s' "$input" | grep -q '"stop_hook_active"[[:space:]]*:[[:space:]]*true'; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}" || exit 0

fail=""
if ! lint_out=$(npm run --silent lint 2>&1); then
  fail+=$'\n[npm run lint 실패]\n'"$(printf '%s' "$lint_out" | tail -30)"
fi
if ! test_out=$(npm run --silent test 2>&1); then
  fail+=$'\n[npm run test 실패]\n'"$(printf '%s' "$test_out" | tail -40)"
fi

if [ -n "$fail" ]; then
  printf 'Stop hook: lint/test가 실패했어요. 원인을 고치거나 사용자에게 보고하세요.%s\n' "$fail" >&2
  exit 2
fi

echo '{"systemMessage": "lint · test 통과"}'
