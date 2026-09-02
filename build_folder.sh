#!/bin/bash
# Produce dist/wild-roots-site/ — the web-root folder ready to copy to a host as-is.
set -euo pipefail
cd "$(dirname "$0")"
STAMP=$(date +%s)
OUT=dist/wild-roots-site
rm -rf "$OUT"; mkdir -p "$OUT"
cp -r site/. "$OUT"/
sed -i -E "s/(css\/styles\.css|js\/main\.js|js\/products\.js|js\/chat\.js)(\?v=[0-9]+)?/\1?v=$STAMP/g" "$OUT"/*.html
find "$OUT" -name '.*' ! -name '.htaccess' -delete 2>/dev/null || true
echo "Built $OUT ($(du -sh "$OUT" | cut -f1), $(find "$OUT" -type f | wc -l) files)"
