#!/usr/bin/env bash
# premium-web-studio installer — copies skills + agents into Claude Code's user (global) or project scope.
#
#   ./install.sh                     # user scope: ~/.claude/skills, ~/.claude/agents (all projects on this machine)
#   ./install.sh --project <dir>     # project scope: <dir>/.claude/skills, <dir>/.claude/agents
#   ./install.sh --dry-run           # show what would happen
#   ./install.sh --force             # replace existing same-named items (old copies are backed up first)
#   ./install.sh --uninstall         # remove only items this installer created (per its manifest)
#
# Preferred alternative (namespaced, updatable, no copying):
#   claude plugin marketplace add jakyherr05-hash/claude-code-skill
#   claude plugin install premium-web-studio@premium-web-studio-marketplace
#
# Safety: never overwrites without --force; backs up anything it replaces to
# <scope>/.claude/backups/premium-web-studio-<timestamp>/; never touches settings.json or MCP config.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN="$HERE/plugins/premium-web-studio"
SCOPE_DIR="$HOME/.claude"
DRY=0; FORCE=0; UNINSTALL=0
while [[ $# -gt 0 ]]; do
  case "$1" in
    --project) SCOPE_DIR="$(cd "${2:?--project needs a directory}" && pwd)/.claude"; shift 2 ;;
    --dry-run) DRY=1; shift ;;
    --force) FORCE=1; shift ;;
    --uninstall) UNINSTALL=1; shift ;;
    -h|--help) sed -n '2,16p' "$0"; exit 0 ;;
    *) echo "unknown option: $1" >&2; exit 1 ;;
  esac
done

MANIFEST="$SCOPE_DIR/.premium-web-studio-installed"
run() { if [[ $DRY == 1 ]]; then echo "  [dry-run] $*"; else "$@"; fi; }

if [[ $UNINSTALL == 1 ]]; then
  [[ -f "$MANIFEST" ]] || { echo "nothing to uninstall (no manifest at $MANIFEST)"; exit 0; }
  while IFS= read -r p; do [[ -n "$p" && -e "$p" ]] && { echo "remove $p"; run rm -rf "$p"; }; done < "$MANIFEST"
  run rm -f "$MANIFEST"; echo "uninstalled."; exit 0
fi

[[ -d "$PLUGIN/skills" && -d "$PLUGIN/agents" ]] || { echo "plugin sources not found under $PLUGIN" >&2; exit 1; }
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP="$SCOPE_DIR/backups/premium-web-studio-$STAMP"
run mkdir -p "$SCOPE_DIR/skills" "$SCOPE_DIR/agents"
installed=(); skipped=(); backed=()

install_item() { # src dest
  local src="$1" dest="$2"
  if [[ -e "$dest" ]]; then
    if [[ $FORCE == 1 ]]; then
      run mkdir -p "$BACKUP/$(basename "$(dirname "$dest")")"
      run cp -R "$dest" "$BACKUP/$(basename "$(dirname "$dest")")/"
      run rm -rf "$dest"; backed+=("$dest")
    else
      skipped+=("$dest"); return
    fi
  fi
  run cp -R "$src" "$dest"; installed+=("$dest")
}

for s in "$PLUGIN"/skills/*/; do install_item "${s%/}" "$SCOPE_DIR/skills/$(basename "$s")"; done
for a in "$PLUGIN"/agents/*.md; do install_item "$a" "$SCOPE_DIR/agents/$(basename "$a")"; done

if [[ $DRY == 0 && ${#installed[@]} -gt 0 ]]; then printf '%s\n' "${installed[@]}" >> "$MANIFEST"; fi
echo "scope: $SCOPE_DIR"
echo "installed: ${#installed[@]}"; for i in "${installed[@]:-}"; do [[ -n "$i" ]] && echo "  + $i"; done
if [[ ${#skipped[@]} -gt 0 ]]; then echo "skipped (already exist — rerun with --force to replace, with backup):"; printf '  = %s\n' "${skipped[@]}"; fi
if [[ ${#backed[@]} -gt 0 ]]; then echo "backed up before replacing → $BACKUP"; fi
echo "Note: if $SCOPE_DIR/agents did not exist when your Claude Code session started, restart the session so the new agents load."
