#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Single Writer 게이트 : 같은 Paper 원장을 두 러너가 동시에 쓰지 못하게 막는다.

왜 필요한가
    모의투자 원장(paper_trading/trades.jsonl 등)은 Source of Truth 다. 집 Windows PC와
    Oracle Linux VM 이 같은 시간에 각자 사이클을 돌면 같은 신호를 두 번 진입하거나,
    한쪽이 만든 커밋 위로 다른 쪽이 rebase 하면서 원장이 갈라진다. 갈라진 원장은
    사후에 되돌릴 수 없다(APPEND-ONLY 기록이라 "어느 쪽이 진짜인지" 판정 불가).

설계
    · 러너 자신이 누구인지는 환경변수 GAEO_PAPER_RUNNER 로 선언한다(WINDOWS / ORACLE).
    · 지금 활성인 러너가 누구인지는 저장소의 paper_runner_config.json 에 둔다.
      이 파일은 러너의 커밋 화이트리스트(paper_trading/ · paper_public.js) 밖에 있어서
      러너가 자기 손으로 자기를 활성화할 수 없다. 전환은 사람이 커밋해야만 일어난다.
    · 판정은 러너 진입점(run_safe)에서 하고, 비활성이면 시세 조회도 하지 않는다.
      토스 토큰은 client 당 유효 토큰이 1개라, 비활성 러너가 토큰을 발급받는 것만으로도
      활성 러너의 토큰을 무효화할 수 있다. 그래서 provider 를 만들기 전에 막는다.

⭐ 선언이 없을 때(GAEO_PAPER_RUNNER 미설정)는 "비활성"으로 본다 = fail closed.
    반대(미설정이면 활성)로 두면, Oracle VM 에 환경변수를 빠뜨린 채 timer 를 켜는 순간
    두 러너가 동시에 원장을 쓰게 된다. 그건 되돌릴 수 없는 사고다.
    반면 fail closed 쪽의 손해는 "그 사이클을 안 돈다"이고, 그건 되돌릴 수 있는 데다
    paper-health-alert 워크플로가 거래일에 기록이 0건이면 이슈로 알려 준다(조용히 죽지 않는다).
    실제 운영에서 사람이 환경변수를 매번 챙기지 않아도 되도록, 러너 스크립트
    (scripts/paper_cycle.ps1 · scripts/paper_cycle.sh)가 자기 이름을 스스로 선언한다.
    즉 사람이 실수할 여지가 있는 쪽은 "안 도는 쪽"으로만 기운다.
"""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))

#: 러너가 "나는 누구다"를 선언하는 환경변수.
ENV_NAME = "GAEO_PAPER_RUNNER"
#: 지금 누가 활성인지를 담은 저장소 설정 파일(러너 커밋 화이트리스트 밖).
CONFIG_FILENAME = "paper_runner_config.json"
CONFIG_PATH = os.path.join(HERE, CONFIG_FILENAME)
#: 허용된 러너 이름. 설정 파일이 아니라 코드에 둔다 :
#: 파일을 고쳐서 허용 범위를 넓히는 경로를 만들지 않기 위해서다.
KNOWN_RUNNERS = ("WINDOWS", "ORACLE")

# 판정 코드(로그·테스트가 문자열로 고정해 쓴다)
ACTIVE = "ACTIVE_RUNNER"
UNDECLARED = "RUNNER_UNDECLARED"
UNKNOWN_NAME = "RUNNER_UNKNOWN"
NOT_ACTIVE = "RUNNER_NOT_ACTIVE"
CONFIG_MISSING = "CONFIG_MISSING"
CONFIG_UNREADABLE = "CONFIG_UNREADABLE"
CONFIG_INVALID = "CONFIG_INVALID"


class Decision:
    """게이트 판정 결과. allowed 가 True 일 때만 사이클을 돌 수 있다."""

    __slots__ = ("allowed", "code", "declared", "active", "message")

    def __init__(self, allowed, code, declared, active, message):
        self.allowed = allowed
        self.code = code
        self.declared = declared
        self.active = active
        self.message = message

    def __repr__(self):                      # 디버깅용(로그에는 message 만 쓴다)
        return f"<Decision {self.code} allowed={self.allowed}>"


def _norm(value):
    """공백·대소문자 차이로 러너가 비활성이 되는 사고를 막는다."""
    return str(value or "").strip().upper()


def _safe(value):
    """로그에 그대로 실어도 되는 형태로 자른다(설정 오타를 그대로 보여주되 길이는 제한)."""
    keep = [c for c in str(value or "") if c.isalnum() or c in "_-."]
    return "".join(keep)[:24] or "(없음)"


def declared_runner(env=None):
    """이 프로세스가 선언한 러너 이름. 선언이 없으면 빈 문자열."""
    env = os.environ if env is None else env
    return _norm(env.get(ENV_NAME))


def read_active_runner(config_path=None):
    """설정 파일에서 활성 러너를 읽는다. 반환 (활성러너, 실패코드)."""
    path = config_path or CONFIG_PATH
    if not os.path.exists(path):
        return "", CONFIG_MISSING
    try:
        with open(path, encoding="utf-8") as f:
            cfg = json.load(f)
    except Exception:                         # noqa: BLE001 - 원인 종류와 무관하게 fail closed
        return "", CONFIG_UNREADABLE
    if not isinstance(cfg, dict):
        return "", CONFIG_INVALID
    active = _norm(cfg.get("activeRunner"))
    if active not in KNOWN_RUNNERS:
        return "", CONFIG_INVALID
    return active, ""


def decide(declared, active, config_error=""):
    """순수 판정 함수(파일·환경변수를 읽지 않는다). 테스트가 이걸 직접 고정한다."""
    if config_error:
        return Decision(
            False, config_error, declared, "",
            f"single-writer: 활성 러너 설정을 읽지 못해 이번 사이클을 돌지 않습니다 "
            f"({CONFIG_FILENAME}: {config_error}). 매매 계산·기록·push 없음")
    if not declared:
        return Decision(
            False, UNDECLARED, "", active,
            f"single-writer: 러너 이름 선언이 없어 이번 사이클을 돌지 않습니다 "
            f"({ENV_NAME} 미설정, 설정상 활성 러너는 {active}). 매매 계산·기록·push 없음")
    if declared not in KNOWN_RUNNERS:
        return Decision(
            False, UNKNOWN_NAME, declared, active,
            f"single-writer: 알 수 없는 러너 이름이라 돌지 않습니다 "
            f"(선언 {_safe(declared)}, 허용 {'/'.join(KNOWN_RUNNERS)}). 매매 계산·기록·push 없음")
    if declared != active:
        return Decision(
            False, NOT_ACTIVE, declared, active,
            f"single-writer: 이 러너는 비활성입니다 (선언 {declared}, 활성 {active}). "
            f"매매 계산·기록·push 없음")
    return Decision(True, ACTIVE, declared, active,
                    f"single-writer: 활성 러너입니다 (선언 {declared}, 활성 {active})")


def check(env=None, config_path=None):
    """환경변수와 설정 파일을 읽어 판정한다."""
    active, err = read_active_runner(config_path)
    return decide(declared_runner(env), active, err)


def allow(label, env=None, config_path=None, log=print):
    """러너 진입점용 한 줄 게이트. 통과하면 True, 막히면 사유를 찍고 False."""
    d = check(env=env, config_path=config_path)
    log(f"[{label}] {d.message}")
    return d.allowed


if __name__ == "__main__":                    # 사람이 상태만 확인할 때(진단 스크립트가 쓴다)
    _d = check()
    print(_d.message)
    raise SystemExit(0 if _d.allowed else 1)
