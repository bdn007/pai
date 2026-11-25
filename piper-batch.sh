#!/usr/bin/env bash
set -euo pipefail

if (($# == 0)); then
  printf 'Usage: %s "first text" ["second text" ...]\n' "$0" >&2
  exit 2
fi

piper_python="$HOME/piper-venv/bin/python"
voice_dir="$HOME/piper-voices"
voice="en_US-ryan-medium"

if [[ ! -x "$piper_python" ]]; then
  printf 'Piper Python environment not found: %s\n' "$piper_python" >&2
  exit 1
fi

if [[ ! -f "$voice_dir/$voice.onnx" || ! -f "$voice_dir/$voice.onnx.json" ]]; then
  printf 'Voice model not found in %s. Download it with:\n' "$voice_dir" >&2
  printf '%s -m piper.download_voices --data-dir "%s" %s\n' "$piper_python" "$voice_dir" "$voice" >&2
  exit 1
fi

outputs=()
index=1
for text in "$@"; do
  if [[ -z "$text" ]]; then
    printf 'Text %d is empty; provide non-empty text for every output.\n' "$index" >&2
    exit 2
  fi

  printf -v default_output 'speech%02d.wav' "$index"
  read -r -e -p "Output file name for text $index [$default_output]: " output
  output="${output:-$default_output}"
  if [[ "$output" != *.wav ]]; then
    output="$output.wav"
  fi

  if [[ -e "$output" ]]; then
    printf 'Refusing to overwrite existing file: %s\n' "$output" >&2
    exit 1
  fi

  for existing_output in "${outputs[@]}"; do
    if [[ "$output" == "$existing_output" ]]; then
      printf 'Duplicate output file name: %s\n' "$output" >&2
      exit 2
    fi
  done

  outputs+=("$output")
  index=$((index + 1))
done

index=0
for text in "$@"; do
  output="${outputs[$index]}"
  "$piper_python" -m piper \
    -m "$voice" \
    --data-dir "$voice_dir" \
    -f "$output" \
    -- "$text"
  printf 'Created %s\n' "$output"
  index=$((index + 1))
done
