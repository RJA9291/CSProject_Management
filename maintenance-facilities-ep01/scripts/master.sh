#!/usr/bin/env bash
# Two-pass loudness normalisation to -16 LUFS / -1.5 dBTP; video stream copied as-is.
set -euo pipefail
cd "$(dirname "$0")/.."
IN=${1:-output/render_raw.mp4}
OUT=${2:-output/episode01.mp4}
STATS=$(ffmpeg -hide_banner -nostats -i "$IN" -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
get() { echo "$STATS" | grep "\"$1\"" | sed -E 's/.*: "([^"]+)".*/\1/'; }
ffmpeg -hide_banner -loglevel error -y -i "$IN" -c:v copy \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):offset=$(get target_offset):linear=true,aresample=48000" \
  -c:a aac -b:a 320k -movflags +faststart "$OUT"
echo "Mastered -> $OUT"
