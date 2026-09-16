#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Claude Code Stop 훅 — 작업 보고 뒤에 GPT 보고용 코드블록이 없으면 멈추지 못하게 한다.

왜 있나 (2026-09-16 사용자 지정, 고정)
    대표는 작업이 끝날 때마다 GPT 에 그대로 붙일 보고문을 **코드블록 하나**로 받기를 원한다.
    "기억해라" 로는 여러 번 빠졌다. 그래서 기억이 아니라 하네스가 막는다: 마지막 답변이 작업 보고인데
    GPT 보고 코드블록이 없으면 이 훅이 stop 을 막고 "붙여라" 를 지시한다.

판정 규칙 (LLM 없음)
    · 마지막 assistant 텍스트가 400자 이상(= 작업 보고로 본다) 인데
    · ``` 로 시작하는 코드블록 중 첫 줄(또는 그 다음 줄)에 'GPT' 또는 '[GAEO' 가 든 블록이 없으면 → block
    · 400자 미만(짧은 상태 한 줄, 안전망 조용한 종료 등) 은 통과
    · stop_hook_active 가 true 면(이미 이 훅 때문에 이어서 쓴 뒤) 무한 반복을 막기 위해 통과
    · 전사 파일을 못 읽으면 통과(훅 고장이 대화를 막으면 안 된다) — 대신 stderr 에 사유를 남긴다

입출력
    stdin: Claude Code 훅 JSON({"transcript_path", "stop_hook_active", ...})
    stdout: {"decision": "block", "reason": "..."} 또는 아무것도 안 씀(통과). 종료코드 0.
"""
import json
import os
import re
import sys

MIN_REPORT_CHARS = 400
FENCE_RE = re.compile(r"```[^\n]*\n(.*?)```", re.S)
MARKER_RE = re.compile(r"GPT|\[GAEO", re.I)

REASON = (
    "GPT 보고용 코드블록이 없다 (2026-09-16 사용자 지정 · .claude/hooks/gpt_report_gate.py). "
    "지금 답변 맨 끝에 ``` 로 감싼 코드블록 **하나** 를 붙여라: 첫 줄은 '[GAEO — <작업명> 보고 · YYYY-MM-DD]' 형식, "
    "내용은 GPT 가 그대로 이어받을 수 있게 결론·변경 파일·검증 결과·SHA/PR·남은 조치·하지 않은 것 을 기술 용어 그대로 적는다. "
    "코드블록은 하나만, 블록 밖 설명은 쉬운 한국어로. 이 훅은 이어서 쓴 답변에는 다시 개입하지 않는다."
)


def last_assistant_text(path):
    text_parts = []
    with open(path, encoding="utf-8", errors="replace") as handle:
        for line in handle:
            line = line.strip()
            if not line:
                continue
            try:
                entry = json.loads(line)
            except ValueError:
                continue
            if entry.get("type") != "assistant":
                continue
            message = entry.get("message") or {}
            content = message.get("content")
            parts = []
            if isinstance(content, str):
                parts.append(content)
            elif isinstance(content, list):
                for block in content:
                    if isinstance(block, dict) and block.get("type") == "text":
                        parts.append(block.get("text") or "")
            if parts:
                text_parts = parts          # 마지막 assistant 메시지만 남긴다
    return "\n".join(text_parts)


def has_gpt_block(text):
    for match in FENCE_RE.finditer(text):
        body = match.group(1)
        head = "\n".join(body.splitlines()[:2])
        if MARKER_RE.search(head):
            return True
    return False


def decide(payload):
    if payload.get("stop_hook_active"):
        return None                          # 이미 한 번 막았다 — 반복 금지
    path = payload.get("transcript_path")
    if not path or not os.path.isfile(path):
        sys.stderr.write("gpt_report_gate: transcript_path 없음 — 통과\n")
        return None
    try:
        text = last_assistant_text(path)
    except OSError as exc:
        sys.stderr.write(f"gpt_report_gate: 전사 읽기 실패({exc}) — 통과\n")
        return None
    visible = re.sub(r"\s+", " ", text).strip()
    if len(visible) < MIN_REPORT_CHARS:
        return None
    if has_gpt_block(text):
        return None
    return {"decision": "block", "reason": REASON}


def main():
    try:
        payload = json.load(sys.stdin)
    except ValueError:
        payload = {}
    verdict = decide(payload)
    if verdict:
        print(json.dumps(verdict, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
