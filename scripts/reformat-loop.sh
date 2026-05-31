#!/bin/zsh
# Drives codex to reformat all pending posts into report HTML, in batches, resumable.
# Usage: scripts/reformat-loop.sh [shard] [of] [batch]
set -u
cd "${0:A:h}/.."
SHARD=${1:-0}; OF=${2:-1}; BATCH=${3:-5}
LOG=/tmp/reformat-shard${SHARD}-of${OF}.log
: > "$LOG"
echo "[$(date)] start shard=$SHARD/$OF batch=$BATCH" >> "$LOG"

count_reports() { find data/reports -type f -name '*.json' | wc -l | tr -d ' '; }
stall=0

while true; do
  LIST=$(node scripts/list-pending-reports.mjs "$BATCH" --shard "$SHARD" --of "$OF" 2>>"$LOG")
  if [ -z "$LIST" ]; then
    echo "[$(date)] shard $SHARD: no pending left — DONE" >> "$LOG"
    break
  fi
  before=$(count_reports)
  echo "[$(date)] shard $SHARD batch (reports=$before):" >> "$LOG"
  echo "$LIST" | cut -f1,2 >> "$LOG"
  PROMPT="Reformat EACH post below into premium research-report HTML following scripts/REPORT-FORMAT.md EXACTLY (read it first). You are the writer and translator — do NOT call any external API. Only create files under data/reports/. For each post write data/reports/<kind>/<key>.json = {\"id\":\"<id>\",\"ko\":{\"title\":\"...\",\"html\":\"<inner report HTML>\"},\"en\":{\"title\":\"...\",\"html\":\"<inner report HTML>\"},\"sourceHash\":\"<sha256 of the source file contents>\",\"specVersion\":2,\"generatedAt\":\"<ISO>\"}. Write each file as you finish it (incremental). CRITICAL per spec: keep ALL source links as working <a> tags, and add images/diagrams to aid understanding. Preserve real facts/numbers; do not fabricate. Posts (TSV columns: kind, key, sourcePath, id):
$LIST"
  codex exec -C "$PWD" --dangerously-bypass-approvals-and-sandbox -o "/tmp/reformat-shard${SHARD}-last.txt" < /dev/null "$PROMPT" >> "$LOG" 2>&1 \
    || { echo "[$(date)] shard $SHARD: codex non-zero, backing off 60s" >> "$LOG"; sleep 60; }
  after=$(count_reports)
  if [ "$after" -le "$before" ]; then
    stall=$((stall+1))
    echo "[$(date)] shard $SHARD: no progress ($stall)" >> "$LOG"
    if [ "$stall" -ge 4 ]; then echo "[$(date)] shard $SHARD: stalled, exiting" >> "$LOG"; break; fi
    sleep 30
  else
    stall=0
  fi
  sleep 8
done
echo "[$(date)] shard $SHARD loop ended (reports=$(count_reports))" >> "$LOG"
