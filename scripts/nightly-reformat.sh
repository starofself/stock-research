#!/bin/zsh
# Nightly: reformat any newly-posted content into report HTML (ko + en), then push.
# Scheduled via cron (19:00 daily). Operates on the currently checked-out branch.
set -u
export PATH="/Users/starofselfhigmail.com/.local/bin:/Users/starofselfhigmail.com/.local/opt/node-current/bin:/usr/bin:/bin:/usr/local/bin:$PATH"
REPO="/Users/starofselfhigmail.com/Developer/stock-research"
LOG="/tmp/nightly-reformat-$(date +%F).log"
exec >> "$LOG" 2>&1
echo "===== nightly-reformat start $(date) ====="
cd "$REPO" || { echo "no repo"; exit 1; }

# Skip if a manual/other reformat grind is already running (avoid clashes)
if pgrep -f "scripts/reformat-loop.sh" >/dev/null 2>&1; then
  echo "reformat-loop already running — skipping tonight"; exit 0
fi

LOCK="/tmp/nightly-reformat.lock"
if [ -e "$LOCK" ]; then echo "lock present — skip"; exit 0; fi
trap 'rm -f "$LOCK"' EXIT
touch "$LOCK"

echo "branch=$(git rev-parse --abbrev-ref HEAD)"
git pull --ff-only || echo "(pull skipped/failed)"

PENDING=$(node scripts/list-pending-reports.mjs 0 2>&1 1>/dev/null)
echo "$PENDING"

# Reformat all pending new posts (single shard)
./scripts/reformat-loop.sh 0 1 5

git add data/reports data/i18n 2>/dev/null
if ! git diff --cached --quiet; then
  git commit -m "data: nightly report reformat $(date +%F)"
  git push && echo "pushed" || echo "push failed"
else
  echo "no new reports to commit"
fi
echo "===== nightly-reformat done $(date) ====="
