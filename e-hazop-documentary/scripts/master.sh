#!/usr/bin/env bash
# Final audio mastering + web-optimised MP4.
# Normalises the mix to -16 LUFS integrated / -1.5 dBTP (social platform target),
# keeps the Remotion video stream untouched and moves the moov atom to the front.
set -euo pipefail
cd "$(dirname "$0")/.."
IN=${1:-output/render_raw.mp4}
OUT=${2:-output/E-HAZOP_Basic_Concept_MET264016.mp4}

# pass 1: measure
STATS=$(ffmpeg -hide_banner -nostats -i "$IN" -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
get() { echo "$STATS" | grep "\"$1\"" | sed -E 's/.*: "([^"]+)".*/\1/'; }

# pass 2: apply (linear), encode AAC 320k 48 kHz
# re-encode video at CRF 20 / slow (keeps the file under GitHub's 100 MB limit, visually transparent for graphics)
ffmpeg -hide_banner -y -loglevel error -i "$IN" -c:v libx264 -crf ${CRF:-20} -preset slow -pix_fmt yuv420p -tune animation \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):offset=$(get target_offset):linear=true,aresample=48000" \
  -c:a aac -b:a 320k -movflags +faststart "$OUT"

echo "Mastered -> $OUT"
ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate -of compact "$OUT"
