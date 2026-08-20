#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="/app/frontend/.env"
BACKEND_URL="$(grep '^REACT_APP_BACKEND_URL=' "$ENV_FILE" | cut -d= -f2-)"

check_asset() {
  local path="$1"
  local max_bytes="$2"
  local url="${BACKEND_URL}${path}"
  local header_file
  header_file="$(mktemp)"

  echo "--- HEAD ${url} ---"
  curl -sS -I -L "$url" | tee "$header_file"

  local status
  status="$(awk 'toupper($0) ~ /^HTTP\// { code=$2 } END { print code }' "$header_file")"
  local content_length
  content_length="$(awk 'BEGIN{IGNORECASE=1} /^content-length:/ { gsub(/\r/, "", $2); len=$2 } END { print len }' "$header_file")"

  if [[ "$status" != "200" ]]; then
    echo "FAIL ${path}: expected HTTP 200, got ${status:-missing}"
    return 1
  fi

  if [[ -z "${content_length}" ]]; then
    echo "No Content-Length in HEAD response; falling back to full download byte count."
    content_length="$(curl -sS -L -o /dev/null -w '%{size_download}' "$url")"
  fi

  echo "Measured ${path}: ${content_length} bytes (threshold ${max_bytes})"
  if (( content_length >= max_bytes )); then
    echo "FAIL ${path}: too large"
    return 1
  fi

  echo "PASS ${path}"
}

echo "Local file sizes:"
stat -c '%n %s bytes' /app/public/vertex-logo.png /app/public/vertex-profile.png

check_asset "/vertex-logo.png" 200000
check_asset "/vertex-profile.png" 300000
