#!/bin/bash

set -e

echo "=============================="
echo
echo "installerar..."
echo
echo "=============================="

cd hideout

npm i

npm run build

rm -rf ../public/* # Ta bort allt
# flytta
cp -R dist/* ../public/

# rm public/css/* -f
# rm public/js/* -f
# rm public/fonts/* -f

# mv dist/css/* public/css/
# mv dist/js/* public/js/
# mv dist/fonts/* public/fonts/

# echo '<meta http-equiv="Refresh" content="0; url=https://elevnarvaro.web.app/" />' > 404.html

echo "=============================="
echo
echo "Laddar upp..."
echo
echo "=============================="

firebase deploy --only hosting
