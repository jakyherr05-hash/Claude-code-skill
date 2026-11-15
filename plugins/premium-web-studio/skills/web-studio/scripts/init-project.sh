#!/usr/bin/env bash
# init-project.sh <project-root> "<Project Name>"
# Creates <project-root>/studio/ from the web-studio templates. Never overwrites existing files.
set -euo pipefail
ROOT="${1:?usage: init-project.sh <project-root> \"<Project Name>\"}"
NAME="${2:-Untitled Project}"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$HERE/templates/project-docs"
DEST="$ROOT/studio"
DATE="$(date +%Y-%m-%d)"
mkdir -p "$DEST"
created=0; kept=0
for f in "$SRC"/*.md; do
  out="$DEST/$(basename "$f")"
  if [[ -e "$out" ]]; then kept=$((kept+1)); continue; fi
  # escape sed replacement metacharacters in the name
  esc_name=$(printf '%s' "$NAME" | sed -e 's/[\/&|]/\\&/g')
  sed -e "s|{{PROJECT_NAME}}|$esc_name|g" -e "s|{{DATE}}|$DATE|g" "$f" > "$out"
  created=$((created+1))
done
echo "studio docs: $created created, $kept already existed (kept) → $DEST"
