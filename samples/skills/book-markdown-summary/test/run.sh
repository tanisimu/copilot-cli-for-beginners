#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
node ./cli.js < test/test_input.txt > test/output.txt
if grep -q "サンプルタイトル" test/output.txt && grep -q "山田 太郎" test/output.txt; then
  echo "TEST PASSED"
  cat test/output.txt
  exit 0
else
  echo "TEST FAILED"
  echo "--- output ---"
  cat test/output.txt
  exit 2
fi
