#!/bin/bash
# Deploy site/ to https://wr.corpmos.com with cache-busting asset versions.
set -euo pipefail

SRC="$(cd "$(dirname "$0")/site" && pwd)"
DEST=/var/www/wr-corpmos-com
STAMP=$(date +%s)

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
cp -r "$SRC"/. "$TMP"/; rm -f "$TMP"/.htaccess  # Apache-only file

# stamp css/js references so browsers fetch fresh copies after each deploy
sed -i -E "s/(css\/styles\.css|js\/main\.js|js\/products\.js|js\/chat\.js)(\?v=[0-9]+)?/\1?v=$STAMP/g" "$TMP"/*.html

sudo cp -r "$TMP"/. "$DEST"/
sudo chmod -R a+rX "$DEST"
echo "Deployed to $DEST (asset version $STAMP)"
