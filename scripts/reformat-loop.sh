#!/bin/zsh
# Drives codex to reformat all pending posts into report HTML, in batches, resumable.
# Usage: scripts/reformat-loop.sh [shard] [of] [batch]
set -u
cd "${0:A:h}/.."
SHARD=${1:-0}; OF=${2:-1}; BATCH=${3:-5}
LOG=/tmp/reformat-shard${SHARD}-of${OF}.log
: > "$LOG"
AGENT=${REFORMAT_AGENT:-codex}
echo "[$(date)] start shard=$SHARD/$OF batch=$BATCH agent=$AGENT" >> "$LOG"

# Count reports already upgraded to the current spec (v2). Using total file
# count breaks during a re-do pass because files are overwritten, not added.
count_reports() {
  node -e "const fs=require('fs'),p=require('path');let v=0;for(const k of['blog','note']){const d='data/reports/'+k;try{for(const f of fs.readdirSync(d)){try{if(JSON.parse(fs.readFileSync(p.join(d,f))).specVersion===2)v++}catch{}}}catch{}}console.log(v)" 2>/dev/null || echo 0
}
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
  if [ "$AGENT" = "claude" ]; then
    claude -p "$PROMPT" --permission-mode bypassPermissions < /dev/null >> "$LOG" 2>&1 \
      || { echo "[$(date)] shard $SHARD: claude non-zero, backing off 60s" >> "$LOG"; sleep 60; }
  else
    codex exec -C "$PWD" --dangerously-bypass-approvals-and-sandbox -o "/tmp/reformat-shard${SHARD}-last.txt" < /dev/null "$PROMPT" >> "$LOG" 2>&1 \
      || { echo "[$(date)] shard $SHARD: codex non-zero, backing off 60s" >> "$LOG"; sleep 60; }
  fi
  after=$(count_reports)
  if [ "$after" -le "$before" ]; then
    stall=$((stall+1))
    echo "[$(date)] shard $SHARD: no progress ($stall)" >> "$LOG"
    # Be patient through codex rate-limit / reconnects; only give up after a long dry spell.
    if [ "$stall" -ge 40 ]; then echo "[$(date)] shard $SHARD: stalled 40x, exiting" >> "$LOG"; break; fi
    sleep 45
  else
    stall=0
  fi
  sleep 8
done
echo "[$(date)] shard $SHARD loop ended (reports=$(count_reports))" >> "$LOG"
