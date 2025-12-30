#!/bin/bash -ex

./node_modules/.bin/puppeteer browsers install chrome

OUT_DIR=$(mktemp -d)
OUT_FILE="${OUT_DIR}/out.pdf"

./node_modules/.bin/tsx ./scripts/pdf/cli.ts 'http://localhost:3030/' "${OUT_FILE}"

# remove blank pages
./scripts/pdf/trim-blank-pages.sh "${OUT_FILE}" './public/aleksi-asikainen-resume.pdf'

rm -rf ${OUT_DIR}
