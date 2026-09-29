#!/bin/bash
#
# Says, on a session's first turn, when a brief has merged but was never
# recorded in docs/reader/profile.md - the step that went missing for round 4.
#
# The project's own hook, not the factory's: session-start.sh belongs to the
# factory and /update-agents copies it wholesale, while settings.json and every
# other hook in it belong to this repository. See .claude/commands/round.md for
# the procedure this checks.
#
# Like session-start.sh it reports and never gates, always exits 0, and prints
# nothing when there is nothing to say. It reads only the checked-out files,
# with no network access, so it costs nothing and cannot fail on credentials. It sees what
# is on the current branch, which in a fresh session is main.

cd "${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}" 2>/dev/null || exit 0

profile=docs/reader/profile.md
[ -f "$profile" ] || exit 0

# The issue a brief document is recorded under in `Briefs:`. From round 3 on
# that is the research issue, which is also the document's number. Rounds 1
# and 2 predate that and are recorded under the brief issue that was filed for
# them, so they are mapped here rather than guessed.
recorded_as() {
  case "$1" in
    19) echo 24 ;;
    26) echo 29 ;;
    *)  echo "$1" ;;
  esac
}

briefs_lines="$(grep -F '*Briefs:' "$profile")"
missing=()

for doc in docs/research/*brief*.md; do
  [ -f "$doc" ] || continue
  n="$(basename "$doc" | cut -d- -f1)"
  case "$n" in ''|*[!0-9]*) continue ;; esac
  issue="$(recorded_as "$n")"
  if ! grep -qE "issues/${issue}\)" <<<"$briefs_lines"; then
    missing+=("$doc (#$issue)")
  fi
done

[ ${#missing[@]} -gt 0 ] || exit 0

echo "Reader state is behind: these briefs merged but no topic in $profile lists them under Briefs:"
for m in "${missing[@]}"; do
  echo "  $m"
done
echo "Run /round deliver: read the report back in full, then update topic state (runs, last, Briefs, Items, run in flight)."
exit 0
