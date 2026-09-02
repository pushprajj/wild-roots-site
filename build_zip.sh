#!/bin/bash
# Package site/ as a web-root zip for upload to any static host.
set -euo pipefail
cd "$(dirname "$0")"
STAMP=$(date +%s)
OUT="dist/wild-roots-site-$(date +%Y%m%d).zip"
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
mkdir -p dist
cp -r site/. "$TMP"/
sed -i -E "s/(css\/styles\.css|js\/main\.js|js\/products\.js|js\/chat\.js)(\?v=[0-9]+)?/\1?v=$STAMP/g" "$TMP"/*.html
rm -f "$OUT"
python3 - "$TMP" "$OUT" <<'PY'
import sys, zipfile, os
src, out = sys.argv[1], sys.argv[2]
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
    for root, dirs, files in os.walk(src):
        dirs[:] = sorted(d for d in dirs if not d.startswith('.'))
        for f in sorted(files):
            if f.startswith('.') and f != '.htaccess': continue
            full = os.path.join(root, f)
            z.write(full, os.path.relpath(full, src))
PY
echo "Built $OUT ($(du -h "$OUT" | cut -f1))"
