#!/usr/bin/env python3
"""Catch a PR #564-class bug generically: a generator wrote a new file this
cycle, but the explicit git-add allowlist in update-analysis.yml didn't know
about it, so it stays dirty and later makes decision_records.safe_merge()
fail with an opaque "Runner merge needs a committed working tree" error far
from the real cause (that incident: rebound_watch.js missing from the `for f
in ...` loop). The fix for that one file is already in the loop; this script
is the generalization so the *next* new generated file gets caught here,
loudly and specifically, instead of surfacing later as an unexplained merge
refusal.

Run this from the analysis workflow's own step, in its own working directory,
right after the explicit git-add allowlist loop and before `git commit`. It
never modifies the working tree itself (no git add/checkout/reset/clean) -
the caller decides what to do with a nonzero exit. The intended caller
response is to skip this cycle's commit (fall through to the existing
"변경 없음 - 커밋 생략" branch) and still reach chain() at the end of the
script - never `exit` here, or a real generator bug turns into the same
"575분 무갱신" chain-death class of incident this repo already fixed once
(see the git-pull-rebase comment right above the retry loop in the same
workflow file).

Exit 0: nothing is left dirty except the two files this job always restores
        to HEAD before staging (data.js/analysis.js, owned by update-prices.yml).
Exit 1: something the add-loop should have staged is still dirty. Prints one
        line per offending path, classified so the cause is visible without
        having to reproduce the incident locally.
"""
import subprocess
import sys

# update-analysis.yml runs `git checkout HEAD -- data.js analysis.js
# price_provenance.json` right before the add-loop specifically to hand these
# back to update-prices.yml untouched. If they still show dirty here, that
# restore step itself failed - worth a distinct message, but still a failure
# (category B: another pipeline's own output, never this job's to commit
# either way).
#
# price_provenance.json (2026-09-15) is data.js's price-provenance companion,
# written by the same collector in the same round. The analysis job reads it
# (sync_inputs pulls both from origin) but must never commit it, exactly like
# data.js. Leaving it out here would mean the analysis cycle finds it dirty
# every time and silently skips every commit - the PR #564 failure mode this
# script exists to prevent, caused by this script.
RESTORED_BEFORE_STAGING = frozenset(('data.js', 'analysis.js', 'price_provenance.json'))


def dirty_after_staging(cwd=None):
    """Return (other_owner, unexpected) path lists still dirty in the worktree
    after the caller's git-add allowlist loop has already run. A path that is
    fully staged (worktree column is a space) is not returned - the allowlist
    already caught it and this is not this script's concern.
    """
    result = subprocess.run(
        # quotePath=false: a non-ASCII path (Korean docs, etc.) must compare as
        # plain UTF-8, not git's default octal-escaped quoting.
        ['git', '-c', 'core.quotePath=false', 'status',
         '--porcelain=v1', '--untracked-files=all'],
        cwd=cwd, capture_output=True, text=True, timeout=30, check=True,
    )
    other_owner, unexpected = [], []
    for line in result.stdout.splitlines():
        if not line:
            continue
        worktree_status, path = line[1], line[3:]
        if ' -> ' in path:  # rename entries read "old -> new"
            path = path.split(' -> ', 1)[1]
        if worktree_status == ' ':
            continue  # fully staged; the allowlist loop already added this
        (other_owner if path in RESTORED_BEFORE_STAGING else unexpected).append(path)
    return other_owner, unexpected


def main():
    other_owner, unexpected = dirty_after_staging()
    if not other_owner and not unexpected:
        return 0
    for path in other_owner:
        print('::error::SAVE_CLOSURE_FAILURE(다른 파이프라인 소유 파일이 HEAD로 복원되지 않음): ' + path)
    for path in unexpected:
        print('::error::SAVE_CLOSURE_FAILURE(생성됐지만 저장 목록에 없거나 예상 밖 변경): ' + path)
    return 1


if __name__ == '__main__':
    sys.exit(main())
