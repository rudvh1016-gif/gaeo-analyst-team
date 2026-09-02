#!/usr/bin/env python3
"""Report relative-time language in indexable human content without rewriting it."""
import argparse
import datetime as dt
import json
import os
import re
import subprocess
import sys


SOURCES = (
    ("news_analysis.js", "NEWS_ANALYSIS", "news"),
    ("stock_study.js", "STOCK_STUDY", "study"),
    ("stock_lessons.js", "STOCK_LESSONS", "lesson"),
    ("estate_lessons.js", "ESTATE_LESSONS", "estate"),
    ("calculators.js", "CALCULATORS", "calc"),
)
DEFAULT_PHRASES = ("오늘", "내일", "어제", "이번 주", "다음 주", "금주", "이번 달", "다음 달", "방금", "곧", "현재")
FIELDS = ("title", "name", "summary", "intro", "body")
PHRASE_PATTERN = re.compile("|".join(re.escape(x) for x in sorted(DEFAULT_PHRASES, key=len, reverse=True)))
QUOTE_PAIRS = (("“", "”"), ("「", "」"), ('"', '"'), ("‘", "’"), ("'", "'"))


def _publication_date(item):
    value = str(item.get("date") or "")
    try:
        return dt.date.fromisoformat(value)
    except ValueError as error:
        raise ValueError(f"content {item.get('id')}: invalid publication date {value!r}") from error


def _quote_spans(text):
    spans = []
    for opening, closing in QUOTE_PAIRS:
        cursor = 0
        while cursor < len(text):
            start = text.find(opening, cursor)
            if start < 0:
                break
            end = text.find(closing, start + len(opening))
            if end < 0:
                break
            spans.append((start, end + len(closing)))
            cursor = end + len(closing)
    return spans


def scan_item(source_file, mode, item, as_of):
    published = _publication_date(item)
    age_days = (as_of - published).days
    findings = []
    for field in FIELDS:
        text = str(item.get(field) or "")
        spans = _quote_spans(text)
        for match in PHRASE_PATTERN.finditer(text):
            phrase = match.group(0)
            if phrase == "오늘" and text[match.end():match.end() + 1] == "날":
                continue
            left = max(0, match.start() - 60)
            right = min(len(text), match.end() + 60)
            context = re.sub(r"\s+", " ", text[left:right]).strip()
            findings.append({
                "source_file": source_file,
                "mode": mode,
                "content_id": item.get("id"),
                "publication_date": published.isoformat(),
                "field": field,
                "phrase": phrase,
                "context": context,
                "age_days": age_days,
                "quoted_context": any(start <= match.start() < end for start, end in spans),
            })
    return findings


def _load_array_from_source(source, variable):
    loader = (
        "let s='';process.stdin.setEncoding('utf8');"
        "process.stdin.on('data',c=>s+=c);"
        f"process.stdin.on('end',()=>{{try{{const v=new Function(s+';return {variable};')();"
        "process.stdout.write(JSON.stringify(v));}catch(e){console.error(e.message);process.exit(1);}});"
    )
    result = subprocess.run(["node", "-e", loader], input=source, text=True, capture_output=True, timeout=30)
    if result.returncode:
        raise RuntimeError(f"could not load {variable}: {result.stderr.strip()}")
    value = json.loads(result.stdout)
    if not isinstance(value, list):
        raise RuntimeError(f"{variable} must be an array")
    return value


def load_array(root, source_file, variable):
    with open(os.path.join(root, source_file), encoding="utf-8") as handle:
        return _load_array_from_source(handle.read(), variable)


def scan_repository(root, as_of):
    findings = []
    for source_file, variable, mode in SOURCES:
        for item in load_array(root, source_file, variable):
            findings.extend(scan_item(source_file, mode, item, as_of))
    return findings


def changed_content_keys(root, base_ref):
    changed = set()
    for source_file, variable, mode in SOURCES:
        current = {str(item.get("id")): item for item in load_array(root, source_file, variable)}
        result = subprocess.run(
            ["git", "show", f"{base_ref}:{source_file}"], cwd=root, text=True,
            encoding="utf-8", errors="replace", capture_output=True, timeout=30,
        )
        if result.returncode:
            raise RuntimeError(f"cannot compare {source_file} with {base_ref}: {result.stderr.strip()}")
        previous = {str(item.get("id")): item for item in _load_array_from_source(result.stdout, variable)}
        for content_id, item in current.items():
            if previous.get(content_id) != item:
                changed.add((mode, item.get("id")))
    return changed


def strict_findings(findings, changed_keys):
    return [row for row in findings
            if (row["mode"], row["content_id"]) in changed_keys and not row["quoted_context"]]


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", default=os.path.dirname(os.path.abspath(__file__)))
    parser.add_argument("--as-of", help="YYYY-MM-DD; default is validated LIVE_DATA date")
    parser.add_argument("--json", action="store_true", help="emit machine-readable JSON")
    parser.add_argument("--strict", action="store_true", help="fail for unquoted findings in changed content")
    parser.add_argument("--base-ref", default="origin/main", help="Git ref used by strict mode")
    args = parser.parse_args(argv)

    try:
        if args.as_of:
            as_of = dt.date.fromisoformat(args.as_of)
        else:
            with open(os.path.join(args.root, "data.js"), encoding="utf-8") as handle:
                match = re.search(r'"date"\s*:\s*"(\d{4}-\d{2}-\d{2})(?:\s|\\")', handle.read())
            if not match:
                raise RuntimeError("data.js LIVE_DATA.date does not start with YYYY-MM-DD")
            as_of = dt.date.fromisoformat(match.group(1))
        findings = scan_repository(args.root, as_of)
        changed = changed_content_keys(args.root, args.base_ref) if args.strict else set()
        blocking = strict_findings(findings, changed) if args.strict else []
    except (ValueError, RuntimeError, OSError, subprocess.TimeoutExpired, json.JSONDecodeError) as error:
        print(f"content freshness audit failed: {error}", file=sys.stderr)
        return 2

    payload = {
        "as_of": as_of.isoformat(),
        "status": "fail" if blocking else ("warning" if findings else "pass"),
        "finding_count": len(findings),
        "strict_finding_count": len(blocking),
        "changed_content": [{"mode": mode, "content_id": content_id} for mode, content_id in sorted(changed)],
        "findings": findings,
    }
    if args.json:
        print(json.dumps(payload, ensure_ascii=False, indent=2))
    else:
        print(f"상대시점 표현 감사: {payload['status']} · 기준일 {payload['as_of']} · 후보 {len(findings)}건")
        for row in findings:
            quote = " · 인용맥락" if row["quoted_context"] else ""
            print(f"- {row['source_file']} {row['mode']}#{row['content_id']} {row['publication_date']} "
                  f"({row['age_days']}일) [{row['field']}] {row['phrase']}{quote}: {row['context']}")
        if args.strict:
            print(f"strict 대상: 변경 콘텐츠 {len(changed)}건, 차단 후보 {len(blocking)}건")
    return 1 if blocking else 0


if __name__ == "__main__":
    sys.exit(main())

