#!/usr/bin/env bash
set -euo pipefail

IN="${1:?usage: trim-blank-pages.sh in.pdf out.pdf [threshold]}"
OUT="${2:?usage: trim-blank-pages.sh in.pdf out.pdf [threshold]}"
THRESHOLD="${3:-0.00001}"   # treat pages with <= this ink as blank

command -v gs >/dev/null || { echo "Missing: ghostscript (gs)"; exit 1; }
command -v pdfcpu >/dev/null || { echo "Missing: pdfcpu"; exit 1; }

# Ghostscript inkcov prints blocks like:
# Page 1
# 0.00000 0.00000 0.00000 0.00000 CMYK OK
# (format shown in examples)  [oai_citation:2‡TeX - LaTeX Stack Exchange](https://tex.stackexchange.com/questions/53493/detecting-all-pages-which-contain-color?utm_source=chatgpt.com)
KEEP_PAGES="$(
  gs -q -o - -sDEVICE=inkcov "$IN" 2>/dev/null |
  awk -v thr="$THRESHOLD" '
    NF>=4 {
      page = NR
      c=$1; m=$2; y=$3; k=$4
      if (c>thr || m>thr || y>thr || k>thr) keep[++n]=page
    }
    END {
      for (i=1; i<=n; i++) {
        printf "%s%d", (i==1 ? "" : ","), keep[i]
      }
    }
  '
)"

if [[ -z "$KEEP_PAGES" ]]
then
  echo "All pages have content; copying input to output."
  cp "$IN" "$OUT"
  exit 0
fi

echo "Keeping pages ${KEEP_PAGES}"

# Keep only the pages we detected as non-blank.
# pdfcpu supports explicit selections via -pages.  [oai_citation:3‡pdfcpu](https://pdfcpu.io/getting_started/page_selection.html?utm_source=chatgpt.com)
pdfcpu trim -pages "$KEEP_PAGES" "$IN" "$OUT" >/dev/null

