#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""러너 장부 포함성 판정 + 재기준 전 백업 — "로컬 paper_trading 의 모든 기록이 원격에 들어 있는가"를 **내용으로** 증명한다 (2026-09-10 구간 A).

왜 있나
  2026-09-10 첫 판(paper_cycle.sh/.ps1)은 (트리 해시 같음) 또는 (원격 state.json 의 lastCycleAt 이 같거나 더 새로움)이면
  "원격이 다 가졌다"고 보고 origin/main 으로 재기준(checkout -B)했다. 시각이 같거나 새롭다는 것은 거래·수량·현금·
  다른 모의계좌(smart_v2·scalp_v3 …)의 기록이 전부 들어 있다는 증거가 아니다. 백업 ref 가 남아도 활성 장부에서 기록이
  빠지면 운영 복구가 아니다. 그래서 시각 비교 fallback 을 없애고, 이 모듈이 파일 내용으로 포함성을 증명한다.

판정 규칙 (fail closed — 증명하지 못하면 "포함 아님")
  1. 두 트리의 모든 장부 파일 바이트가 같다 → COVERED (강한 근거).
  2. 아니면 파일마다:
     · *.jsonl (trades·equity_curve·skip_quotes·observations·shadow_swaps·chief_path·skipped_candidates 같은 이벤트 원장):
       로컬의 모든 줄(JSON 정규화 내용의 다중집합 — 거래 ID·수량·가격·현금이 전부 들어간 내용 해시)이 원격 같은 파일에
       있어야 한다. 한 줄이라도 빠지면 NOT_COVERED.
     · state.json: 같으면 OK. 다르면 lastCycleAt 을 비교해 원격이 **더 새롭고**, 그 계좌의 이벤트 원장 포함이 전부 성립하고,
       보유 투영이 증명될 때만 OK — 로컬 보유 목록(openMeta)이 로컬 원장의 OPEN 거래와 일치하고, 원격 보유 목록도 원격
       원장과 일치하며, 로컬 OPEN 거래 전부가 원격 원장에 (OPEN 또는 CLOSED 로) 있어야 한다. 현금은 별도 필드가 없고
       equity_curve.jsonl 의 회차 줄(cash)이 이벤트 원장 포함으로 검증된다. 원격이 더 오래됐거나, 같은 시각인데 내용이
       다르면 NOT_COVERED(어느 쪽이 맞는지 증명 불가).
     · 그 밖의 *.json (summary·history*·config): 같으면 OK. 다르면 그 계좌의 state.json 판정이 OK 일 때만 OK(파생 스냅샷).
     · README.md 같은 비원장 파일은 무시한다.
     · 로컬에만 있는 파일·계좌 폴더 → NOT_COVERED. 원격에만 있는 것은 상관없다(원격이 앞선 것).
  3. 비어 있거나 JSON 으로 읽을 수 없는 장부 파일, lastCycleAt·openMeta 가 없는 state.json 은 "같음"으로 통과시키지 않는다
     → UNDETERMINED (역시 포함 아님). "모른다"를 "괜찮다"로 바꾸지 않는다.

백업 (backup)
  재기준(checkout -B) 전에 (a) 작업트리의 paper_trading 전체(미커밋·untracked 포함)를 복사하고 원본을 다시 읽어 바이트
  단위로 대조, (b) 저장소 객체가 상한(GAEO_PAPER_BUNDLE_MAX_MB, 기본 512) 이하일 때만 옛 HEAD 와 refs/gaeo-backup/* 를
  git bundle 로 묶어 `git bundle verify` 로 검증(공통 조상이 없으면 bundle 은 옛 이력 전체가 되므로 큰 저장소에서는 생략하고
  manifest 에 적는다 — 옛 커밋은 refs/gaeo-backup/* 가 보존), (c) sha256 목록(manifest.json)을 남긴다. 어느 단계든 실패하면
  예외 → 호출자는 재기준하지 않고, 반쯤 만든 폴더는 `<이름>.failed` 로 이름을 바꿔 둔다. 기존 폴더는 절대 덮어쓰지 않는다.

쓰는 곳
  · scripts/paper_cycle.sh / .ps1 — 원격 이력 재작성(공통 조상 없음) 분기에서 재기준 전에 check → backup 순으로 호출.
  · scripts/paper_recover.sh / .ps1 — 집 PC 복구 도구(검사 모드/실행 모드).
  · 표준 라이브러리만 쓴다(집 PC 파이썬에서도 그대로 돈다).

    python3 paper_ledger_inclusion.py check --repo <러너 저장소> [--local HEAD] [--remote origin/main] [--worktree] [--json]
    python3 paper_ledger_inclusion.py backup --repo <러너 저장소> --dest <백업 폴더> [--label 이름] [--not-ref origin/main] [--json]
    python3 paper_ledger_inclusion.py verify-backup --dir <백업 폴더/이름> [--json]
    python3 paper_ledger_inclusion.py summary --repo <러너 저장소> [--json]        (계좌별 마지막 회차·거래 줄·보유)
종료코드: check 0 COVERED · 1 NOT_COVERED · 2 UNDETERMINED(오류·해석 불가) / backup·verify-backup 0 성공 · 2 실패.
0 이 아니면 전부 "재기준하지 않는다".
"""
import argparse
import datetime
import hashlib
import json
import os
import shutil
import subprocess
import sys
from collections import Counter

LEDGER_DIR = "paper_trading"
IGNORED_NAMES = {"README.md", ".gitkeep"}
STATE_NAME = "state.json"
TRADES_NAME = "trades.jsonl"
COVERED, NOT_COVERED, UNDETERMINED = "COVERED", "NOT_COVERED", "UNDETERMINED"
MIN_FREE_BYTES = 64 * 1024 * 1024
BACKUP_REF_GLOB = "refs/gaeo-backup/"
# 재작성(공통 조상 없음) 시나리오에서 `--not origin/main` 은 아무것도 빼지 못하므로 bundle 은 옛 이력 **전체**가 된다
# (집 PC 러너 clone 은 9/2 압축 전 전체 이력 → 수 GB). 그래서 저장소 객체 크기가 이 상한을 넘으면 bundle 을 만들지 않고
# manifest 에 그렇게 적는다 — 옛 커밋은 어차피 refs/gaeo-backup/* 가 GC 에서 지켜 준다. 장부 복사본은 항상 만든다.
BUNDLE_MAX_BYTES = int(os.environ.get("GAEO_PAPER_BUNDLE_MAX_MB", "512")) * 1024 * 1024
BUNDLE_TIMEOUT_SEC = 1800
# 루트 계좌 폴더에 있지만 다른 계좌의 파생 스냅샷인 파일(paper_public._write_history 가 만든다)
ROOT_FILE_ACCOUNT = {"history_v2.json": "smart_v2", "history_v3.json": "scalp_v3"}


# ---------------------------------------------------------------- 트리 읽기

def _git(repo, *args, timeout=600):
    r = subprocess.run(["git", "-C", repo, *args], capture_output=True, timeout=timeout)
    return r.returncode, r.stdout, r.stderr.decode("utf-8", "replace")


def _sha256_path(path):
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        for chunk in iter(lambda: fh.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def repo_object_bytes(repo):
    """저장소 객체 크기(느슨한 객체 + pack, 바이트). 조회 실패면 None."""
    code, out, _ = _git(repo, "count-objects", "-v")
    if code != 0:
        return None
    kib = 0
    for line in out.decode("utf-8", "replace").splitlines():
        k, _, v = line.partition(":")
        if k.strip() in ("size", "size-pack"):
            try:
                kib += int(v.strip())
            except ValueError:
                return None
    return kib * 1024


def read_tree_from_git(repo, ref, subdir=LEDGER_DIR):
    """ref 의 subdir 아래 모든 파일 → {상대경로: bytes}. ref 에 subdir 가 없으면 {}. git 실패는 RuntimeError."""
    code, out, err = _git(repo, "ls-tree", "-r", "--name-only", "-z", ref, "--", subdir)
    if code != 0:
        raise RuntimeError(f"git ls-tree {ref} 실패: {err.strip()}")
    files = {}
    for name in out.decode("utf-8", "surrogateescape").split("\0"):
        if not name:
            continue
        code, blob, err = _git(repo, "show", f"{ref}:{name}")
        if code != 0:
            raise RuntimeError(f"git show {ref}:{name} 실패: {err.strip()}")
        files[os.path.relpath(name, subdir).replace("\\", "/")] = blob
    return files


def read_tree_from_worktree(repo, subdir=LEDGER_DIR):
    """작업트리(미커밋·untracked 포함)의 subdir → {상대경로: bytes}."""
    root = os.path.join(repo, subdir)
    files = {}
    if not os.path.isdir(root):
        return files
    for base, dirs, names in os.walk(root):
        dirs[:] = [d for d in dirs if not d.startswith(".")]
        for n in names:
            p = os.path.join(base, n)
            with open(p, "rb") as fh:
                files[os.path.relpath(p, root).replace("\\", "/")] = fh.read()
    return files


# ---------------------------------------------------------------- 파싱

def _normalize(obj):
    return json.dumps(obj, sort_keys=True, ensure_ascii=False, separators=(",", ":"))


def parse_jsonl(data):
    """각 줄을 정규화한 문자열의 리스트. 빈 파일은 []. 깨진 줄이 있으면 ValueError."""
    text = data.decode("utf-8-sig")
    rows = []
    for i, line in enumerate(text.splitlines(), 1):
        if not line.strip():
            continue
        try:
            rows.append(_normalize(json.loads(line)))
        except ValueError as e:
            raise ValueError(f"{i}행 JSON 아님: {e}") from e
    return rows


def parse_json(data):
    text = data.decode("utf-8-sig").strip()
    if not text:
        raise ValueError("빈 파일")
    obj = json.loads(text)
    if not isinstance(obj, dict):
        raise ValueError("JSON 객체가 아니다")
    return obj


def _account_of(rel):
    parts = rel.split("/")
    if len(parts) > 1:
        return parts[0]
    return ROOT_FILE_ACCOUNT.get(parts[0], ".")


def _is_ledger_name(rel):
    return os.path.basename(rel) not in IGNORED_NAMES


def _row_label(row_norm):
    try:
        d = json.loads(row_norm)
        return d.get("trade_id") or d.get("at") or row_norm[:60]
    except ValueError:
        return row_norm[:60]


def _ts(value):
    """lastCycleAt 문자열 → aware datetime. 없거나 해석 불가면 None."""
    if not isinstance(value, str) or not value.strip():
        return None
    v = value.strip()
    if v.endswith("Z"):
        v = v[:-1] + "+00:00"
    try:
        d = datetime.datetime.fromisoformat(v)
    except ValueError:
        return None
    if d.tzinfo is None:
        return None
    return d


def _open_ids(rows_norm):
    """이벤트 원장(trades.jsonl) 줄들 → (마지막 상태가 OPEN 인 trade_id 집합, {trade_id: 마지막 상태})."""
    latest = {}
    for r in rows_norm:
        d = json.loads(r)
        tid = d.get("trade_id")
        if tid:
            latest[str(tid)] = d.get("status")
    return {t for t, s in latest.items() if s == "OPEN"}, latest


# ---------------------------------------------------------------- 판정

def compare_trees(local, remote):
    """local/remote: {상대경로: bytes}. 판정 dict 를 돌려준다(verdict/reasons/files/accounts)."""
    result = {"verdict": COVERED, "reasons": [], "files": {}, "accounts": {},
              "localFiles": len(local), "remoteFiles": len(remote)}
    ledger_local = {p: b for p, b in local.items() if _is_ledger_name(p)}
    ledger_remote = {p: b for p, b in remote.items() if _is_ledger_name(p)}
    if not ledger_local:
        result["verdict"] = UNDETERMINED
        result["reasons"].append("로컬 장부 파일이 하나도 없다 — 비교할 것이 없으면 포함으로 보지 않는다")
        return result
    if ledger_local == ledger_remote:
        result["reasons"].append("모든 장부 파일의 바이트가 같다(강한 근거)")
        return result

    undetermined, not_covered = [], []
    acct_events_ok = {}      # 계좌 → 이벤트 원장(jsonl) 포함 전부 성립?
    acct_state_ok = {}       # 계좌 → state.json 판정 OK?
    per_file = result["files"]
    rows_cache = {}

    def rows(side, rel):
        key = (side, rel)
        if key not in rows_cache:
            src = ledger_local if side == "local" else ledger_remote
            rows_cache[key] = parse_jsonl(src[rel]) if rel in src else []
        return rows_cache[key]

    # 1) 이벤트 원장(jsonl) — 로컬 줄 다중집합 ⊆ 원격 줄 다중집합
    for rel, data in sorted(ledger_local.items()):
        if not rel.endswith(".jsonl"):
            continue
        acct = _account_of(rel)
        acct_events_ok.setdefault(acct, True)
        try:
            lrows = rows("local", rel)
        except ValueError as e:
            per_file[rel] = {"status": UNDETERMINED, "why": f"로컬 해석 실패: {e}"}
            undetermined.append(f"{rel}: 로컬 {e}"); acct_events_ok[acct] = False
            continue
        if rel not in ledger_remote:
            if not lrows:
                per_file[rel] = {"status": COVERED, "why": "로컬 파일이 비어 있어 잃을 줄이 없다", "localRows": 0, "remoteRows": 0}
            else:
                per_file[rel] = {"status": NOT_COVERED, "why": "원격에 파일 없음", "localRows": len(lrows)}
                not_covered.append(f"{rel}: 원격에 없다(로컬 {len(lrows)}줄)"); acct_events_ok[acct] = False
            continue
        try:
            rrows = rows("remote", rel)
        except ValueError as e:
            per_file[rel] = {"status": UNDETERMINED, "why": f"원격 해석 실패: {e}"}
            undetermined.append(f"{rel}: 원격 {e}"); acct_events_ok[acct] = False
            continue
        missing = list((Counter(lrows) - Counter(rrows)).elements())
        if missing:
            labels = [_row_label(m) for m in missing[:5]]
            per_file[rel] = {"status": NOT_COVERED, "why": f"원격에 없는 로컬 줄 {len(missing)}개", "missing": labels,
                             "localRows": len(lrows), "remoteRows": len(rrows)}
            not_covered.append(f"{rel}: 원격에 없는 줄 {len(missing)}개 (예: {', '.join(str(x) for x in labels)})")
            acct_events_ok[acct] = False
        else:
            per_file[rel] = {"status": COVERED, "why": "로컬 줄 전부 원격에 있음", "localRows": len(lrows), "remoteRows": len(rrows)}

    # 2) state.json — 같음 / (원격이 더 새로움 + 이벤트 원장 전부 포함 + 보유 투영 증명) 만 OK
    def holdings_projection(acct, ls, rs):
        trades_rel = TRADES_NAME if acct == "." else f"{acct}/{TRADES_NAME}"
        try:
            lrows, rrows = rows("local", trades_rel), rows("remote", trades_rel)
        except ValueError as e:
            return UNDETERMINED, f"{trades_rel} 해석 실패: {e}"
        for side, st in (("로컬", ls), ("원격", rs)):
            if not isinstance(st.get("openMeta"), dict):
                return UNDETERMINED, f"{side} state.json 에 openMeta(보유 목록)가 없다"
        l_open, l_latest = _open_ids(lrows)
        r_open, r_latest = _open_ids(rrows)
        if set(ls["openMeta"]) != l_open:
            return UNDETERMINED, f"로컬 보유 목록(openMeta {sorted(ls['openMeta'])})이 로컬 원장 OPEN({sorted(l_open)})과 다르다"
        if set(rs["openMeta"]) != r_open:
            return UNDETERMINED, f"원격 보유 목록(openMeta {sorted(rs['openMeta'])})이 원격 원장 OPEN({sorted(r_open)})과 다르다"
        missing = sorted(t for t in l_open if t not in r_latest)
        if missing:
            return NOT_COVERED, f"로컬 보유 {missing} 가 원격 원장에 없다"
        still_open = sum(1 for t in l_open if r_latest.get(t) == "OPEN")
        closed = sum(1 for t in l_open if r_latest.get(t) == "CLOSED")
        return COVERED, f"로컬 보유 {len(l_open)}건 전부 원격 원장에 있음(원격에서 OPEN {still_open}·CLOSED {closed}), 원격 보유 목록도 원격 원장과 일치"

    for rel, data in sorted(ledger_local.items()):
        if os.path.basename(rel) != STATE_NAME:
            continue
        acct = _account_of(rel)
        if rel not in ledger_remote:
            per_file[rel] = {"status": NOT_COVERED, "why": "원격에 state.json 없음"}
            not_covered.append(f"{rel}: 원격에 없다"); acct_state_ok[acct] = False
            continue
        if data == ledger_remote[rel]:
            per_file[rel] = {"status": COVERED, "why": "동일"}; acct_state_ok[acct] = True
            continue
        try:
            ls, rs = parse_json(data), parse_json(ledger_remote[rel])
        except ValueError as e:
            per_file[rel] = {"status": UNDETERMINED, "why": f"해석 실패: {e}"}
            undetermined.append(f"{rel}: {e}"); acct_state_ok[acct] = False
            continue
        la, ra = _ts(ls.get("lastCycleAt")), _ts(rs.get("lastCycleAt"))
        if la is None or ra is None:
            per_file[rel] = {"status": UNDETERMINED, "why": "lastCycleAt 없음·해석 불가"}
            undetermined.append(f"{rel}: lastCycleAt 없음·해석 불가"); acct_state_ok[acct] = False
            continue
        la_s, ra_s = str(ls.get("lastCycleAt")), str(rs.get("lastCycleAt"))
        if ra > la:
            if not acct_events_ok.get(acct, True):
                per_file[rel] = {"status": NOT_COVERED, "why": "원격이 더 새롭지만 이 계좌의 이벤트 원장에 원격에 없는 로컬 줄이 있다",
                                 "localLastCycleAt": la_s, "remoteLastCycleAt": ra_s}
                not_covered.append(f"{rel}: 원격이 새롭지만 같은 계좌 원장 줄이 빠져 있다"); acct_state_ok[acct] = False
                continue
            hstatus, hwhy = holdings_projection(acct, ls, rs)
            per_file[rel] = {"status": hstatus, "why": f"원격이 더 뒤 회차({ra_s} > {la_s}); {hwhy}",
                             "localLastCycleAt": la_s, "remoteLastCycleAt": ra_s}
            if hstatus == COVERED:
                acct_state_ok[acct] = True
            elif hstatus == UNDETERMINED:
                undetermined.append(f"{rel}: {hwhy}"); acct_state_ok[acct] = False
            else:
                not_covered.append(f"{rel}: {hwhy}"); acct_state_ok[acct] = False
        elif ra == la:
            per_file[rel] = {"status": NOT_COVERED, "why": f"같은 회차({la_s})인데 내용이 다르다 — 어느 쪽이 맞는지 증명 불가"}
            not_covered.append(f"{rel}: 같은 lastCycleAt({la_s})인데 내용이 다르다"); acct_state_ok[acct] = False
        else:
            per_file[rel] = {"status": NOT_COVERED, "why": f"로컬이 더 뒤 회차({la_s} > {ra_s})", "localLastCycleAt": la_s, "remoteLastCycleAt": ra_s}
            not_covered.append(f"{rel}: 로컬 회차({la_s})가 원격({ra_s})보다 새롭다"); acct_state_ok[acct] = False

    # 3) 그 밖의 파일(summary·history*·config 등) — 같음 / 그 계좌 state 판정 OK 일 때만
    for rel, data in sorted(ledger_local.items()):
        if rel.endswith(".jsonl") or os.path.basename(rel) == STATE_NAME:
            continue
        acct = _account_of(rel)
        if rel not in ledger_remote:
            per_file[rel] = {"status": NOT_COVERED, "why": "원격에 파일 없음"}
            not_covered.append(f"{rel}: 원격에 없다")
            continue
        if data == ledger_remote[rel]:
            per_file[rel] = {"status": COVERED, "why": "동일"}
            continue
        if not rel.endswith(".json"):
            # 알 수 없는 형식의 파일이 다르면 파생이라고 가정하지 않는다(장래 엔진이 새 원장 형식을 추가해도 조용히 버리지 않게).
            per_file[rel] = {"status": NOT_COVERED, "why": "장부 형식(.jsonl/.json)이 아닌 파일이 다르다 — 파생으로 가정하지 않는다"}
            not_covered.append(f"{rel}: 알 수 없는 형식의 파일이 다르다")
            continue
        try:
            parse_json(data); parse_json(ledger_remote[rel])
        except ValueError as e:
            per_file[rel] = {"status": UNDETERMINED, "why": f"해석 실패: {e}"}
            undetermined.append(f"{rel}: {e}")
            continue
        if acct_state_ok.get(acct) is True:
            per_file[rel] = {"status": COVERED, "why": "다르지만 이 계좌 state.json 이 원격 우세로 판정됨(파생 스냅샷)"}
        else:
            per_file[rel] = {"status": NOT_COVERED, "why": "다르고 이 계좌 state.json 판정이 OK 가 아니다"}
            not_covered.append(f"{rel}: 내용이 다르고 계좌 상태 판정이 OK 가 아니다")

    accounts = sorted(set(acct_events_ok) | set(acct_state_ok) | {_account_of(p) for p in ledger_local})
    for a in accounts:
        result["accounts"][a] = {"eventsCovered": acct_events_ok.get(a, True), "stateOk": acct_state_ok.get(a)}
    if undetermined:
        result["verdict"] = UNDETERMINED
        result["reasons"] = ["해석 불가·빈 파일·보유 목록 불일치가 있어 포함을 증명할 수 없다"] + undetermined + not_covered
    elif not_covered:
        result["verdict"] = NOT_COVERED
        result["reasons"] = not_covered
    else:
        result["reasons"].append("파일별 내용 비교로 로컬 기록이 전부 원격에 포함됨(이벤트 원장 줄 포함 + 보유 투영 증명)")
    return result


def sha256_manifest(files):
    """{상대경로: sha256} — 백업 검증용."""
    return {p: hashlib.sha256(b).hexdigest() for p, b in sorted(files.items())}


def plain(result):
    lines = [f"[장부 포함성] {result['verdict']} — 로컬 {result['localFiles']}파일 / 원격 {result['remoteFiles']}파일"]
    for r in result["reasons"][:12]:
        lines.append(f"  · {r}")
    for a, v in result.get("accounts", {}).items():
        lines.append(f"  계좌 {a}: 이벤트 원장 포함 {v['eventsCovered']} · state 판정 {v['stateOk']}")
    return "\n".join(lines)


# ---------------------------------------------------------------- 백업

RESTORE_README = """GAEO Paper 러너 재기준 전 백업 ({created})

무엇이 들어 있나
  paper_trading/   재기준 직전 작업트리의 장부 전체 복사본(미커밋·untracked 포함)
  manifest.json    파일별 sha256·크기, 옛 HEAD, bundle 정보
  repo.bundle      옛 HEAD 와 refs/gaeo-backup/* 커밋 묶음(있을 때만 — 저장소가 크면(기본 512MB 초과) 만들지 않는다.
                   공통 조상이 없으면 bundle 은 옛 이력 전체가 되기 때문이다. 옛 커밋은 저장소 안 refs/gaeo-backup/* 가 보존한다)

되돌리는 법(사람이 확인한 뒤에만)
  1) 파일만 필요하면 paper_trading/ 폴더를 그대로 열어 본다. 활성 장부를 이 복사본으로 덮어쓰지 말고, 빠진 기록이 있으면
     기존 방식(엔진의 다음 회차·append)으로만 더한다.
  2) 옛 커밋 이력을 다시 보려면 러너 저장소에서:
       git bundle verify "{bundle}"
       git fetch "{bundle}" HEAD:refs/gaeo-backup/restored-{stamp}
       git log refs/gaeo-backup/restored-{stamp} -3
  3) 검증: python3 paper_ledger_inclusion.py verify-backup --dir "{dir}"
"""


def backup_ledger(repo, dest, label=None, not_ref=None, subdir=LEDGER_DIR):
    """재기준 전 백업. 성공하면 요약 dict, 실패하면 RuntimeError/OSError (호출자는 재기준하지 않는다)."""
    stamp = label or datetime.datetime.now().strftime("%Y%m%dT%H%M%S")
    if os.path.exists(dest) and not os.path.isdir(dest):
        raise RuntimeError(f"백업 경로가 폴더가 아니다: {dest}")
    target = os.path.join(dest, stamp)
    if os.path.exists(target):
        raise RuntimeError(f"백업 폴더가 이미 있다(덮어쓰지 않는다): {target}")
    ledger = read_tree_from_worktree(repo, subdir)
    if not ledger:
        raise RuntimeError(f"백업할 장부 파일이 없다: {os.path.join(repo, subdir)}")
    total = sum(len(b) for b in ledger.values())
    os.makedirs(target)
    try:
        return _backup_into(repo, target, ledger, total, stamp, not_ref, subdir)
    except BaseException:
        # 반쯤 만들어진 폴더를 "백업"으로 오인하지 않게 이름을 바꿔 둔다(삭제하지 않는다 — 원인 조사용).
        failed = target + ".failed"
        try:
            if not os.path.exists(failed):
                os.rename(target, failed)
        except OSError:
            pass
        raise


def _backup_into(repo, target, ledger, total, stamp, not_ref, subdir):
    free = shutil.disk_usage(target).free
    if free < 2 * total + MIN_FREE_BYTES:
        raise RuntimeError(f"디스크 여유 부족: 남은 {free}B < 필요 {2 * total + MIN_FREE_BYTES}B")
    copy_root = os.path.join(target, subdir)
    for rel, data in ledger.items():
        p = os.path.join(copy_root, *rel.split("/"))
        os.makedirs(os.path.dirname(p), exist_ok=True)
        with open(p, "wb") as fh:
            fh.write(data)
    src_again = read_tree_from_worktree(repo, subdir)
    if src_again != ledger:
        raise RuntimeError("백업 중 원본 장부가 바뀌었다(다른 사이클이 돌고 있나?) — 이 백업은 무효")
    copied = read_tree_from_worktree(target, subdir)
    if copied != ledger:
        raise RuntimeError("복사본 검증 실패(원본과 바이트가 다르다)")

    code, out, err = _git(repo, "rev-parse", "HEAD")
    if code != 0:
        raise RuntimeError(f"git rev-parse HEAD 실패: {err.strip()}")
    head = out.decode().strip()
    bundle_path = os.path.join(target, "repo.bundle")
    bundle_info = None
    obj_bytes = repo_object_bytes(repo)
    if obj_bytes is None:
        bundle_note = "저장소 객체 크기를 조회하지 못해 bundle 을 만들지 않았다(옛 커밋은 refs/gaeo-backup/* 가 보존)"
    elif obj_bytes > BUNDLE_MAX_BYTES:
        bundle_note = (f"저장소 객체 {obj_bytes // (1024 * 1024)}MB > 상한 {BUNDLE_MAX_BYTES // (1024 * 1024)}MB — 공통 조상이 없으면 "
                       "bundle 이 옛 이력 전체가 되므로 만들지 않았다(옛 커밋은 refs/gaeo-backup/* 가 GC 에서 보존)")
    elif free < 2 * obj_bytes + 2 * total + MIN_FREE_BYTES:
        bundle_note = f"디스크 여유 {free // (1024 * 1024)}MB 가 bundle 에 부족해 만들지 않았다(옛 커밋은 refs/gaeo-backup/* 가 보존)"
    else:
        args = ["bundle", "create", bundle_path, "HEAD", f"--glob={BACKUP_REF_GLOB}"]
        if not_ref:
            args += ["--not", not_ref]
        try:
            code, out, err = _git(repo, *args, timeout=BUNDLE_TIMEOUT_SEC)
        except subprocess.TimeoutExpired:
            raise RuntimeError(f"git bundle create 가 {BUNDLE_TIMEOUT_SEC}초 안에 끝나지 않았다")
        if code != 0:
            msg = (err + out.decode("utf-8", "replace")).lower()
            if "empty bundle" in msg:
                if os.path.exists(bundle_path):
                    os.remove(bundle_path)
                bundle_note = "옛 HEAD 커밋이 전부 원격에 이미 있어 bundle 을 만들지 않았다"
            else:
                raise RuntimeError(f"git bundle create 실패 (exit {code}): {err.strip()}")
        else:
            code, out, err = _git(repo, "bundle", "verify", bundle_path, timeout=BUNDLE_TIMEOUT_SEC)
            if code != 0:
                raise RuntimeError(f"git bundle verify 실패 (exit {code}): {err.strip()}")
            size = os.path.getsize(bundle_path)
            if size <= 0:
                raise RuntimeError("bundle 파일이 비어 있다")
            bundle_info = {"path": "repo.bundle", "sha256": _sha256_path(bundle_path), "bytes": size}
            bundle_note = "옛 HEAD·refs/gaeo-backup/* 를 bundle 로 묶고 git bundle verify 통과"

    manifest = {
        "schemaVersion": "gaeo_paper_backup_v1",
        "createdAt": datetime.datetime.now().astimezone().isoformat(timespec="seconds"),
        "repo": os.path.abspath(repo), "head": head, "notRef": not_ref, "subdir": subdir,
        "fileCount": len(ledger), "totalBytes": total,
        "files": {rel: {"sha256": hashlib.sha256(b).hexdigest(), "bytes": len(b)} for rel, b in sorted(ledger.items())},
        "bundle": bundle_info, "bundleNote": bundle_note,
    }
    manifest_path = os.path.join(target, "manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as fh:
        json.dump(manifest, fh, ensure_ascii=False, indent=1)
    with open(manifest_path, encoding="utf-8") as fh:
        json.load(fh)
    with open(os.path.join(target, "README.txt"), "w", encoding="utf-8") as fh:
        fh.write(RESTORE_README.format(created=manifest["createdAt"], bundle=bundle_path, stamp=stamp, dir=target))
    verify = verify_backup(target)
    if not verify["ok"]:
        raise RuntimeError("백업 직후 검증 실패: " + "; ".join(verify["problems"]))
    return {"dir": target, "fileCount": len(ledger), "totalBytes": total, "head": head,
            "bundle": bundle_path if bundle_info else None, "bundleBytes": bundle_info["bytes"] if bundle_info else 0,
            "bundleNote": bundle_note, "manifest": manifest_path}


def verify_backup(target):
    """manifest.json 대로 파일이 전부 있고 sha256 이 맞는지, bundle 이 있으면 sha256 이 맞는지 확인한다."""
    problems = []
    manifest_path = os.path.join(target, "manifest.json")
    try:
        with open(manifest_path, encoding="utf-8") as fh:
            m = json.load(fh)
    except (OSError, ValueError) as e:
        return {"ok": False, "problems": [f"manifest.json 을 읽지 못했다: {e}"], "fileCount": 0}
    subdir = m.get("subdir") or LEDGER_DIR
    files = m.get("files") or {}
    if not files:
        problems.append("manifest 에 파일 목록이 없다")
    copied = read_tree_from_worktree(target, subdir)
    for rel, info in files.items():
        if rel not in copied:
            problems.append(f"복사본 없음: {rel}")
            continue
        if hashlib.sha256(copied[rel]).hexdigest() != info.get("sha256"):
            problems.append(f"sha256 불일치: {rel}")
    extra = sorted(set(copied) - set(files))
    if extra:
        problems.append(f"manifest 에 없는 파일이 복사본에 있다: {extra[:5]}")
    if m.get("fileCount") != len(files):
        problems.append("fileCount 가 파일 목록과 다르다")
    b = m.get("bundle")
    if b:
        bp = os.path.join(target, b.get("path") or "repo.bundle")
        try:
            if _sha256_path(bp) != b.get("sha256"):
                problems.append("bundle sha256 불일치")
        except OSError as e:
            problems.append(f"bundle 파일을 읽지 못했다: {e}")
    return {"ok": not problems, "problems": problems, "fileCount": len(files), "head": m.get("head")}


# ---------------------------------------------------------------- 계좌별 요약(복구 도구 보고용)

def ledger_summary(repo, subdir=LEDGER_DIR):
    """작업트리 장부의 계좌별 요약 {계좌: {lastCycleAt, lastCycleResult, openMeta, trades, uniqueTradeIds, openTrades, problem}}."""
    files = read_tree_from_worktree(repo, subdir)
    accounts = {}
    for rel, data in sorted(files.items()):
        if os.path.basename(rel) != STATE_NAME:
            continue
        acct = _account_of(rel)
        info = {"lastCycleAt": None, "lastCycleResult": None, "openMeta": None,
                "trades": None, "uniqueTradeIds": None, "openTrades": None, "problem": None}
        try:
            st = parse_json(data)
            info["lastCycleAt"] = st.get("lastCycleAt")
            info["lastCycleResult"] = str(st.get("lastCycleResult") or "")[:80]
            info["openMeta"] = len(st["openMeta"]) if isinstance(st.get("openMeta"), dict) else None
        except ValueError as e:
            info["problem"] = f"state.json {e}"
        trel = TRADES_NAME if acct == "." else f"{acct}/{TRADES_NAME}"
        if trel in files:
            try:
                rows = parse_jsonl(files[trel])
                opens, latest = _open_ids(rows)
                info["trades"], info["uniqueTradeIds"], info["openTrades"] = len(rows), len(latest), len(opens)
            except ValueError as e:
                info["problem"] = ((info["problem"] or "") + f" trades.jsonl {e}").strip()
        accounts[acct] = info
    return accounts


def summary_lines(accounts):
    lines = []
    for acct, i in accounts.items():
        name = "root(V1)" if acct == "." else acct
        lines.append(f"  계좌 {name}: 마지막 회차 {i['lastCycleAt']} · 결과 {i['lastCycleResult']!s} · 거래 줄 {i['trades']}"
                     f"(고유 {i['uniqueTradeIds']}, 보유 {i['openTrades']}) · 보유 목록 {i['openMeta']}"
                     + (f" · 문제 {i['problem']}" if i["problem"] else ""))
    return lines


# ---------------------------------------------------------------- CLI

def _emit(obj, as_json, plain_text):
    print(json.dumps(obj, ensure_ascii=False, indent=1) if as_json else plain_text)


def main(argv=None):
    argv = list(sys.argv[1:] if argv is None else argv)
    cmd = "check"
    if argv and argv[0] in ("check", "backup", "verify-backup", "summary"):
        cmd = argv.pop(0)

    if cmd == "summary":
        ap = argparse.ArgumentParser(prog="paper_ledger_inclusion.py summary")
        ap.add_argument("--repo", required=True)
        ap.add_argument("--json", action="store_true")
        a = ap.parse_args(argv)
        accounts = ledger_summary(a.repo)
        _emit(accounts, a.json, "\n".join(summary_lines(accounts)) if accounts else "  (장부 계좌 없음)")
        return 0 if accounts else 2

    if cmd == "check":
        ap = argparse.ArgumentParser(prog="paper_ledger_inclusion.py check", description=__doc__.split("\n")[0])
        ap.add_argument("--repo", required=True)
        ap.add_argument("--local", default="HEAD", help="로컬 ref (기본 HEAD). --worktree 면 작업트리를 쓴다")
        ap.add_argument("--remote", default="origin/main")
        ap.add_argument("--worktree", action="store_true", help="로컬을 작업트리(미커밋·untracked 포함)로 읽는다")
        ap.add_argument("--json", action="store_true")
        a = ap.parse_args(argv)
        try:
            local = read_tree_from_worktree(a.repo) if a.worktree else read_tree_from_git(a.repo, a.local)
            remote = read_tree_from_git(a.repo, a.remote)
        except (RuntimeError, OSError, subprocess.SubprocessError) as e:
            res = {"verdict": UNDETERMINED, "reasons": [f"트리를 읽지 못했다: {e}"], "files": {}, "accounts": {},
                   "localFiles": 0, "remoteFiles": 0}
            _emit(res, a.json, plain(res))
            return 2
        res = compare_trees(local, remote)
        _emit(res, a.json, plain(res))
        return {COVERED: 0, NOT_COVERED: 1}.get(res["verdict"], 2)

    if cmd == "backup":
        ap = argparse.ArgumentParser(prog="paper_ledger_inclusion.py backup")
        ap.add_argument("--repo", required=True)
        ap.add_argument("--dest", required=True, help="백업 상위 폴더(클라우드 동기화가 안 되는 로컬 경로)")
        ap.add_argument("--label", default=None, help="백업 폴더 이름(기본 시각)")
        ap.add_argument("--not-ref", default=None, help="이 ref 에 이미 있는 커밋은 bundle 에서 뺀다(예: origin/main)")
        ap.add_argument("--json", action="store_true")
        a = ap.parse_args(argv)
        try:
            info = backup_ledger(a.repo, a.dest, a.label, a.not_ref)
        except (RuntimeError, OSError, subprocess.SubprocessError, ValueError) as e:
            res = {"ok": False, "error": str(e)}
            _emit(res, a.json, f"[백업] 실패: {e}")
            return 2
        res = {"ok": True, **info}
        _emit(res, a.json, f"[백업] 완료: {info['dir']} — 장부 {info['fileCount']}파일 {info['totalBytes']}B, "
                           f"bundle {info['bundleBytes']}B ({info['bundleNote']}), 옛 HEAD {info['head']}")
        return 0

    ap = argparse.ArgumentParser(prog="paper_ledger_inclusion.py verify-backup")
    ap.add_argument("--dir", required=True)
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args(argv)
    res = verify_backup(a.dir)
    _emit(res, a.json, f"[백업 검증] {'OK' if res['ok'] else 'FAIL'} — 파일 {res['fileCount']}개"
                       + ("" if res["ok"] else "; " + "; ".join(res["problems"])))
    return 0 if res["ok"] else 2


if __name__ == "__main__":
    sys.exit(main())
