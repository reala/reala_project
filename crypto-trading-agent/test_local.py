"""로컬 설정 검증 스크립트 — 실제 주문 없이 각 API 연동만 확인한다.

사용법:
    .venv/bin/python test_local.py
"""

from __future__ import annotations

import sys

from dotenv import load_dotenv

load_dotenv()


def _check(label: str, ok: bool, detail: str = "") -> bool:
    status = "OK" if ok else "FAIL"
    suffix = f"  ({detail})" if detail else ""
    print(f"  [{status}] {label}{suffix}")
    return ok


def test_env() -> bool:
    print("\n[1] 환경변수 로드")
    import os

    keys = [
        "UPBIT_ACCESS_KEY",
        "UPBIT_SECRET_KEY",
        "GEMINI_API_KEY",
        "TELEGRAM_BOT_TOKEN",
        "TELEGRAM_CHAT_ID",
    ]
    results = []
    for k in keys:
        val = os.getenv(k, "")
        placeholder = val in ("", "your_upbit_access_key_here", "your_upbit_secret_key_here",
                              "your_gemini_api_key_here", "your_telegram_bot_token_here",
                              "your_telegram_chat_id_here")
        results.append(_check(k, not placeholder, "미설정" if placeholder else val[:8] + "…"))
    return all(results)


def test_upbit_public() -> bool:
    print("\n[2] 업비트 공개 시세 조회 (인증 불필요)")
    try:
        import pyupbit

        price = pyupbit.get_current_price("KRW-BTC")
        return _check("KRW-BTC 현재가", price is not None and price > 0, f"{price:,.0f} KRW" if price else "None")
    except Exception as exc:
        return _check("KRW-BTC 현재가", False, str(exc))


def test_upbit_auth() -> bool:
    print("\n[3] 업비트 인증 (잔고 조회)")
    try:
        from app.config import get_settings
        from app.trading.exchange_client import ExchangeClient

        settings = get_settings()
        client = ExchangeClient(settings.upbit_access_key, settings.upbit_secret_key)
        krw = client.get_krw_balance()
        return _check("KRW 잔고 조회", krw >= 0, f"{krw:,.0f} KRW")
    except ValueError as exc:
        return _check("KRW 잔고 조회", False, f"환경변수 누락: {exc}")
    except Exception as exc:
        return _check("KRW 잔고 조회", False, str(exc))


def test_gemini() -> bool:
    print("\n[4] Gemini API 연결")
    try:
        from app.config import get_settings
        from google import genai

        settings = get_settings()
        client = genai.Client(api_key=settings.gemini_api_key)
        response = client.models.generate_content(
            model=settings.gemini_model,
            contents='{"ping": true} 에 대해 {"pong": true} 만 반환하세요.',
        )
        ok = response.text is not None and len(response.text) > 0
        return _check(f"Gemini {settings.gemini_model}", ok, response.text[:60].strip() if ok else "empty response")
    except ValueError as exc:
        return _check("Gemini", False, f"환경변수 누락: {exc}")
    except Exception as exc:
        return _check("Gemini", False, str(exc))


def test_telegram() -> bool:
    print("\n[5] 텔레그램 봇 연결")
    try:
        from app.config import get_settings
        from app.notifiers.telegram_notifier import send_telegram_message

        settings = get_settings()
        ok = send_telegram_message(
            settings.telegram_bot_token,
            settings.telegram_chat_id,
            "[test_local.py] Crypto Trading Agent 로컬 연결 테스트 메시지",
        )
        return _check("텔레그램 메시지 발송", ok)
    except ValueError as exc:
        return _check("텔레그램", False, f"환경변수 누락: {exc}")
    except Exception as exc:
        return _check("텔레그램", False, str(exc))


def main() -> int:
    print("=" * 50)
    print(" Crypto Trading Agent — 로컬 연결 테스트")
    print("=" * 50)

    env_ok = test_env()
    public_ok = test_upbit_public()

    if not env_ok:
        print("\n.env 파일에 실제 API 키를 입력한 뒤 다시 실행하세요.")
        print("  참고: GEMINI_MODEL 은 기본값 gemini-2.0-flash 사용 가능")
        return 1

    auth_ok = test_upbit_auth()
    gemini_ok = test_gemini()
    telegram_ok = test_telegram()

    passed = sum([env_ok, public_ok, auth_ok, gemini_ok, telegram_ok])
    total = 5
    print(f"\n결과: {passed}/{total} 통과")

    if passed == total:
        print("모든 연동 확인 완료. python -m app.main 으로 실전 실행 가능합니다.")
        return 0

    print("실패 항목을 확인하고 .env 키 또는 업비트 IP 화이트리스트를 점검하세요.")
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
