# -*- coding: utf-8 -*-
"""Constitution 로더 — Evolution 자동 런타임이 바꿀 수 없는 규칙의 단일 원천.

무결성 모델(솔직한 한계 포함):
  같은 저장소에 쓰기 권한이 있는 사람·Claude Code 세션을 물리적으로 막을 수는 없다.
  여기서 보장하는 것은 "자동 런타임(evolution-lab workflow)이" 규칙 파일이 변조된
  상태로는 아무 판정·커밋도 하지 않는다는 것이다:
    1) evolution_constitution.sha256 에 고정된 checksum과 실제 파일이 다르면
       ConstitutionError → SAFE_MODE (FAIL CLOSED).
    2) protected path 검사·commit allowlist 검사가 이 파일의 목록을 쓴다.
  Constitution을 정당하게 바꾸는 절차 = 사람이 JSON과 .sha256을 함께 갱신하고
  일반 코드리뷰/커밋을 거치는 것. 자동 런타임은 두 파일 모두 allowlist 밖이라
  건드릴 수 없다.
"""
import hashlib
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
CONSTITUTION_PATH = os.path.join(HERE, "evolution_constitution.json")
CHECKSUM_PATH = os.path.join(HERE, "evolution_constitution.sha256")

REQUIRED_KEYS = (
    "schemaVersion", "constitutionVersion", "scoringVersion", "protectedPaths",
    "autoCommitAllowlist", "promotionFloor", "statisticalPolicy", "leakagePolicy",
    "riskTiers", "weightBounds", "bootstrapPolicy", "rollbackPolicy",
    "budgetPolicy", "safeModeTriggers",
)


class ConstitutionError(RuntimeError):
    """Constitution이 없거나, 깨졌거나, checksum이 어긋난다. 무조건 FAIL CLOSED."""


def file_sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def write_checksum(constitution_path=CONSTITUTION_PATH, checksum_path=CHECKSUM_PATH):
    """사람이 Constitution을 정당하게 수정한 뒤 수동으로 부르는 도구.

    자동 런타임은 이 함수를 부르지 않는다(두 파일 모두 commit allowlist 밖).
    """
    digest = file_sha256(constitution_path)
    with open(checksum_path, "w", encoding="utf-8", newline="\n") as f:
        f.write(digest + "\n")
    return digest


def load(constitution_path=CONSTITUTION_PATH, checksum_path=CHECKSUM_PATH,
         verify_checksum=True):
    """Constitution을 읽고 검증한다. 실패는 예외 — 절반만 읽은 규칙으로 돌지 않는다."""
    if not os.path.exists(constitution_path):
        raise ConstitutionError("Constitution 파일이 없습니다: " + constitution_path)
    try:
        with open(constitution_path, encoding="utf-8") as f:
            doc = json.load(f)
    except (json.JSONDecodeError, OSError) as exc:
        raise ConstitutionError(f"Constitution 파싱 실패: {exc}") from exc
    for key in REQUIRED_KEYS:
        if key not in doc:
            raise ConstitutionError(f"Constitution 필수 키 누락: {key}")
    if verify_checksum:
        if not os.path.exists(checksum_path):
            raise ConstitutionError(
                "Constitution checksum 파일이 없습니다. 사람이 write_checksum()으로 "
                "고정해야 자동 런타임이 동작합니다: " + checksum_path)
        pinned = open(checksum_path, encoding="utf-8").read().strip()
        actual = file_sha256(constitution_path)
        if pinned != actual:
            raise ConstitutionError(
                "Constitution checksum 불일치 — 파일이 변조됐거나 checksum 갱신을 "
                f"빠뜨렸습니다. pinned={pinned[:12]}… actual={actual[:12]}…")
    return doc


def _normalize(path):
    """경로 정규화 — 구분자 통일 + './' prefix 제거.

    🐛 lstrip("./")는 문자집합 제거라 ".github/…"의 맨 앞 점까지 지워
    보호경로 검사가 뚫렸다(테스트가 잡음). prefix만 정확히 벗긴다.
    """
    norm = str(path).replace("\\", "/")
    while norm.startswith("./"):
        norm = norm[2:]
    return norm


def is_protected(path, constitution):
    """자동 런타임 기준으로 보호된 경로인가(prefix 매칭, 경로 구분자 정규화)."""
    norm = _normalize(path)
    for prefix in constitution["protectedPaths"]:
        p = prefix.replace("\\", "/")
        if norm == p or norm.startswith(p):
            return True
        # 'test_' 같은 파일명 prefix 규칙: 경로 마지막 조각에도 적용한다.
        if "/" not in p and norm.rsplit("/", 1)[-1].startswith(p):
            return True
    return False


def check_changed_paths(changed_paths, constitution):
    """자동 커밋 직전 검사. (위반목록, allowlist외목록)을 돌려준다.

    위반이 하나라도 있으면 호출자는 커밋하지 말아야 한다(FAIL CLOSED).
    """
    allow = [a.replace("\\", "/") for a in constitution["autoCommitAllowlist"]]
    violations, outside = [], []
    for path in changed_paths:
        norm = _normalize(path)
        if is_protected(norm, constitution):
            violations.append(norm)
        elif not any(norm == a or norm.startswith(a) for a in allow):
            outside.append(norm)
    return violations, outside
