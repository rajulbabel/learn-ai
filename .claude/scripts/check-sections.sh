#!/bin/bash
# Stop hook: runs once at end of each Claude turn.
# Scans chapter + shared files changed in working tree (via git diff). If none
# changed, exits silently. Otherwise greps each for visual-rule violations and
# emits a single systemMessage summarizing all issues at once.

set -u
cd "$(git rev-parse --show-toplevel 2>/dev/null)" || exit 0

# Find changed/untracked chapter + shared files
changed=$(
  {
    git diff --name-only -- 'src/chapters/**/*.jsx' 'src/shared/**/*.jsx' 2>/dev/null
    git diff --cached --name-only -- 'src/chapters/**/*.jsx' 'src/shared/**/*.jsx' 2>/dev/null
    git ls-files --others --exclude-standard 'src/chapters/**/*.jsx' 'src/shared/**/*.jsx' 2>/dev/null
  } | sort -u | grep -v '^$'
)

[ -z "$changed" ] && exit 0

issues=""
file_count=0

while IFS= read -r file; do
  [ -f "$file" ] || continue
  file_count=$((file_count + 1))
  per_file=""

  emdash=$(grep -nE '\xe2\x80\x94' "$file" 2>/dev/null)
  [ -n "$emdash" ] && per_file="${per_file}  EM-DASH:
${emdash}
"

  invisible=$(grep -nE 'Box color=\{C\.card\}' "$file" 2>/dev/null)
  [ -n "$invisible" ] && per_file="${per_file}  INVISIBLE BOX (C.card):
${invisible}
"

  # Lowercase cell text. Three exemption layers:
  #   1) Known terms (pgvector, numpy, etc.)
  #   2) snake_case identifiers (any value containing underscore — tool names, var names)
  #   3) Math subscripts (h₁, h₂, w_o1, b_o, nDCG)
  lowcell=$(grep -nE '^[[:space:]]+(name|t|tech|kind|pain|year|cost|trade|metric|threshold|bucket|posture|phase|latency|loss|layer|axis|q|p|stage|label|title|header|side|tier):[[:space:]]+"[a-z]' "$file" 2>/dev/null \
    | grep -vE '"[[:space:]]*(pgvector|numpy|iPhone|none|cosine|ada-002|tenant_id|http|the |gpt-|text-embedding|q_vec|d_vec|k = |m = |ef_|sqrt|fast |slow )' \
    | grep -vE '"[a-zA-Z0-9]*_[a-zA-Z0-9_]+' \
    | grep -vE '"h[₀-₉]|"nDCG|"gradient"|"old_weight|"learning_rate|"new_weight' \
    | grep -vE '"(reason|urgency|transcript|triage)"' \
    | head -10)
  [ -n "$lowcell" ] && per_file="${per_file}  LOWERCASE CELL TEXT:
${lowcell}
"

  lowsvg=$(grep -nE '<text[^>]*>[[:space:]]*[a-z]' "$file" 2>/dev/null \
    | grep -vE '\[CLS\]|\[SEP\]' \
    | head -5)
  [ -n "$lowsvg" ] && per_file="${per_file}  LOWERCASE SVG <text>:
${lowsvg}
"

  if [ -n "$per_file" ]; then
    issues="${issues}
==> $file
${per_file}"
  fi
done <<< "$changed"

if [ -n "$issues" ]; then
  jq -nRs --arg msg "check-visuals warnings (${file_count} chapter files changed):
${issues}
See .claude/rules/sections.md for the full rule list." '{systemMessage: $msg}'
fi

exit 0
