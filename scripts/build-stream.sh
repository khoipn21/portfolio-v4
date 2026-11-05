#!/usr/bin/env bash
# Builds an adaptive HLS stream (five video renditions plus an optional music
# track) for the static media site deployed to Cloudflare Pages.
#
# Usage: scripts/build-stream.sh <source-video> <output-name> [music-file]
# Example: scripts/build-stream.sh ~/Downloads/deep-time.mp4 bioweave/deep-time/v1 score.mp3
# Deploy: npx wrangler pages deploy media/hls --project-name khoipn-media
set -euo pipefail

src=${1:?source video required}
name=${2:?output name required, e.g. bioweave/deep-time/v1}
music=${3:-}
root="$(cd "$(dirname "$0")/.." && pwd)"
out="$root/media/hls/$name"

if [[ "${SKIP_ENCODE:-0}" != 1 ]]; then
  rm -rf "$out"
  mkdir -p "$out"
  (
    cd "$out"
    ffmpeg -v error -stats -y -i "$src" \
      -filter_complex "[0:v]split=5[a][b][c][d][e];[a]scale=2560:1600:flags=lanczos[v0];[b]scale=1920:1200:flags=lanczos[v1];[c]scale=1280:800:flags=lanczos[v2];[d]scale=864:540:flags=lanczos,fps=30[v3];[e]scale=576:360:flags=lanczos,fps=30[v4]" \
      -map "[v0]" -map "[v1]" -map "[v2]" -map "[v3]" -map "[v4]" \
      -c:v libx264 -preset medium -profile:v high -pix_fmt yuv420p -sc_threshold 0 \
      -crf:v:0 21 -maxrate:v:0 12M -bufsize:v:0 24M -g:v:0 120 -keyint_min:v:0 120 \
      -crf:v:1 21 -maxrate:v:1 7M -bufsize:v:1 14M -g:v:1 120 -keyint_min:v:1 120 \
      -crf:v:2 22 -maxrate:v:2 3500k -bufsize:v:2 7M -g:v:2 120 -keyint_min:v:2 120 \
      -crf:v:3 23 -maxrate:v:3 1400k -bufsize:v:3 2800k -g:v:3 60 -keyint_min:v:3 60 \
      -crf:v:4 24 -maxrate:v:4 700k -bufsize:v:4 1400k -g:v:4 60 -keyint_min:v:4 60 \
      -f hls -hls_time 4 -hls_playlist_type vod -hls_segment_type fmp4 -hls_flags independent_segments \
      -master_pl_name master.m3u8 \
      -var_stream_map "v:0,name:1600p v:1,name:1200p v:2,name:800p v:3,name:540p v:4,name:360p" \
      -hls_segment_filename "%v/seg-%03d.m4s" "%v/index.m3u8"
  )
  if [[ -n "$music" ]]; then
    mkdir -p "$out/audio"
    (
      cd "$out"
      duration=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$src")
      fade_start=$(awk -v d="$duration" 'BEGIN { printf "%.2f", d - 2.5 }')
      ffmpeg -v error -y -i "$music" -t "$duration" \
        -af "loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=in:d=0.8,afade=t=out:st=$fade_start:d=2.5" \
        -c:a aac -b:a 128k -ar 48000 -ac 2 \
        -f hls -hls_time 4 -hls_playlist_type vod -hls_segment_type fmp4 \
        -hls_fmp4_init_filename init.mp4 -hls_segment_filename "audio/seg-%03d.m4s" audio/index.m3u8
    )
  fi
fi

# Attach the music track to every video rendition as a default audio group.
if [[ -f "$out/audio/index.m3u8" ]] && ! grep -q 'TYPE=AUDIO' "$out/master.m3u8"; then
  awk '
    /^#EXT-X-VERSION/ {
      print
      print "#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID=\"music\",NAME=\"Music\",LANGUAGE=\"zxx\",DEFAULT=YES,AUTOSELECT=YES,CHANNELS=\"2\",URI=\"audio/index.m3u8\""
      next
    }
    /^#EXT-X-STREAM-INF/ {
      match($0, /BANDWIDTH=[0-9]+/)
      bw = substr($0, RSTART + 10, RLENGTH - 10) + 140000
      sub(/BANDWIDTH=[0-9]+/, "BANDWIDTH=" bw)
      sub(/"$/, ",mp4a.40.2\"")
      print $0 ",AUDIO=\"music\""
      next
    }
    { print }
  ' "$out/master.m3u8" > "$out/master.tmp" && mv "$out/master.tmp" "$out/master.m3u8"
fi

cp "$root/media/_headers" "$root/media/hls/_headers"
du -sh "$out"
