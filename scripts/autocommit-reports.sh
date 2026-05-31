#!/bin/zsh
# Periodically commit+push accumulating report reformats while the grind runs.
# Exits once no reformat-loop is active.
set -u
cd "${0:A:h}/.."
export PATH="/Users/starofselfhigmail.com/.local/bin:/usr/bin:/bin:/usr/local/bin:$PATH"
LOG=/tmp/autocommit-reports.log
: > "$LOG"
echo "[$(date)] autocommit start" >> "$LOG"
for i in $(seq 1 144); do   # up to ~24h at 10-min cadence
  sleep 600
  git add data/reports data/i18n 2>/dev/null
  if ! git diff --cached --quiet; then
    n=$(find data/reports -type f -name '*.json' | wc -l | tr -d ' ')
    git commit -m "data: report reformat progress ($n reports) $(date +%H:%M)" >> "$LOG" 2>&1
    git push >> "$LOG" 2>&1 && echo "[$(date)] pushed ($n reports)" >> "$LOG"
  fi
  if ! pgrep -f "scripts/reformat-loop.sh" >/dev/null 2>&1; then
    echo "[$(date)] grind finished — final commit" >> "$LOG"
    git add data/reports data/i18n 2>/dev/null
    git diff --cached --quiet || { git commit -m "data: report reformat final $(date +%F)" >> "$LOG" 2>&1; git push >> "$LOG" 2>&1; }
    break
  fi
done
echo "[$(date)] autocommit end" >> "$LOG"
