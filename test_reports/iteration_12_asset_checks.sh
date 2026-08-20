#!/usr/bin/env bash
set -euo pipefail
ENV_FILE="/app/frontend/.env"
BACKEND_URL="$(grep '^REACT_APP_BACKEND_URL=' "$ENV_FILE" | cut -d= -f2-)"
if [[ -z "$BACKEND_URL" ]]; then
  echo "FAIL: REACT_APP_BACKEND_URL missing" >&2
  exit 1
fi

printf 'BACKEND_URL=%s\n' "$BACKEND_URL"
printf 'Local file sizes:\n'
stat -c '%n %s bytes' /app/public/vertex-logo.png /app/public/vertex-profile.png

header_check() {
  local path="$1"
  local header_file="/tmp/headers_${path//\//_}.txt"
  printf '\n--- HEAD %s%s ---\n' "$BACKEND_URL" "$path"
  curl -sS -I -L "$BACKEND_URL$path" | tee "$header_file"
  local status
  status="$(awk 'toupper($0) ~ /^HTTP\// { code=$2 } END { print code }' "$header_file")"
  local length
  length="$(awk 'BEGIN{IGNORECASE=1} /^content-length:/ { gsub(/\r/, "", $2); len=$2 } END { print len }' "$header_file")"
  if [[ "$status" != "200" ]]; then
    echo "FAIL: $path final HEAD status expected 200, got ${status:-missing}" >&2
    return 1
  fi
  if [[ -z "$length" ]]; then
    length="$(curl -sS -L -o /dev/null -w '%{size_download}' "$BACKEND_URL$path")"
    echo "No Content-Length; measured GET size=${length}"
  fi
  echo "RESULT header path=$path status=$status content_length=$length"
}

header_check /vertex-logo.png
header_check /vertex-profile.png

printf '\nTiming GET downloads (5 cold request attempts each):\n'
for path in /vertex-logo.png /vertex-profile.png; do
  for i in 1 2 3 4 5; do
    curl -sS -L -o /dev/null -w "TIMING path=$path run=$i status=%{http_code} time_total=%{time_total} size_download=%{size_download}\n" "$BACKEND_URL$path"
  done
done
