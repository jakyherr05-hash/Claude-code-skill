#!/usr/bin/env bash
# encode-video.sh <input> <outDir> [maxWidth=1920] [crf_h264=23]
# Web-ready background/hero video set:
#   <name>.mp4   H.264 High, yuv420p, +faststart (universal)
#   <name>.webm  VP9 (smaller; Chrome/Firefox/Edge/Safari 14.1+)
#   <name>.av1.mp4  AV1 via SVT-AV1 if available (smallest; modern browsers) — optional
#   <name>-poster.jpg / .webp  first-second poster frame
# Audio is stripped (background loops must be muted for autoplay anyway).
set -euo pipefail
IN="${1:?usage: encode-video.sh <input> <outDir> [maxWidth] [crf]}"
OUT="${2:?outDir required}"
MAXW="${3:-1920}"
CRF="${4:-23}"
command -v ffmpeg >/dev/null || { echo "ffmpeg not found (install: apt install ffmpeg | brew install ffmpeg)"; exit 2; }
mkdir -p "$OUT"
NAME="$(basename "${IN%.*}")"
SCALE="scale='min(${MAXW},iw)':-2:flags=lanczos"

ffmpeg -y -hide_banner -loglevel error -i "$IN" -an -vf "$SCALE" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p -preset slow -crf "$CRF" -movflags +faststart "$OUT/$NAME.mp4"

ffmpeg -y -hide_banner -loglevel error -i "$IN" -an -vf "$SCALE" \
  -c:v libvpx-vp9 -b:v 0 -crf $((CRF + 10)) -row-mt 1 -deadline good -cpu-used 2 "$OUT/$NAME.webm"

# Capture first: with `set -o pipefail`, `ffmpeg -encoders | grep -q` makes grep exit early, ffmpeg dies of
# SIGPIPE and the whole pipeline reads as "not found" even when the encoder exists.
ENCODERS="$(ffmpeg -hide_banner -encoders 2>/dev/null || true)"
if grep -q libsvtav1 <<<"$ENCODERS"; then
  ffmpeg -y -hide_banner -loglevel error -i "$IN" -an -vf "$SCALE" \
    -c:v libsvtav1 -crf $((CRF + 12)) -preset 6 -pix_fmt yuv420p -movflags +faststart "$OUT/$NAME.av1.mp4"
fi

ffmpeg -y -hide_banner -loglevel error -ss 0.5 -i "$IN" -frames:v 1 -vf "$SCALE" -q:v 3 "$OUT/$NAME-poster.jpg"
ffmpeg -y -hide_banner -loglevel error -i "$OUT/$NAME-poster.jpg" -c:v libwebp -quality 75 "$OUT/$NAME-poster.webp"

echo "encoded → $OUT"
for f in "$OUT/$NAME".*  "$OUT/$NAME"-poster.*; do printf '  %-40s %6s KB\n' "$(basename "$f")" "$(( $(stat -c%s "$f" 2>/dev/null || stat -f%z "$f") / 1024 ))"; done
echo
echo "<video autoplay muted loop playsinline preload=\"metadata\" poster=\"$NAME-poster.webp\">"
[[ -f "$OUT/$NAME.av1.mp4" ]] && echo "  <source src=\"$NAME.av1.mp4\" type='video/mp4; codecs=\"av01.0.08M.08\"'>"
echo "  <source src=\"$NAME.webm\" type=\"video/webm\">"
echo "  <source src=\"$NAME.mp4\" type=\"video/mp4\">"
echo "</video>"
echo "(Pause off-screen and under prefers-reduced-motion.)"
