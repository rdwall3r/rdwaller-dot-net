#!/usr/bin/env bash
set -euo pipefail

PORT=8080
BASE_URL="http://localhost:${PORT}"

cd "$(dirname "$0")/.."

echo "Cleaning previous build..."
rm -rf _site

echo "Building site..."
npx @11ty/eleventy > /dev/null

echo "Starting dev server on ${BASE_URL}..."
npx @11ty/eleventy --serve --port="${PORT}" --quiet > /tmp/a11y-scan-server.log 2>&1 &
SERVER_PID=$!

cleanup() {
  kill "${SERVER_PID}" 2>/dev/null || true
}
trap cleanup EXIT

for _ in $(seq 1 30); do
  if curl -sf "${BASE_URL}" > /dev/null; then
    break
  fi
  sleep 1
done

urls=()
while IFS= read -r -d '' file; do
  rel="${file#_site}"
  rel="${rel%index.html}"
  urls+=("${BASE_URL}${rel}")
done < <(find _site -name "index.html" -not -path "*/.claude/*" -print0)

echo "Found ${#urls[@]} pages to scan."
axe "${urls[@]}"
