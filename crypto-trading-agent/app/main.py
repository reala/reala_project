"""1-Turn 실행 제어 오케스트레이터.

흐름:
  1. 업비트에서 3대장 시장 스냅샷 수집 (Python, Gemini 호출 없음)
  2. Gemini 1-Turn 쿼리 → target_ticker + BUY / SELL / HOLD 판정
  3. 판정에 따라 업비트 주문 집행 (5,000원 물리 락)
  4. 결과를 텔레그램으로 즉시 발송
  5. history.json에 일지 기록 및 깃 커밋
"""

from __future__ import annotations

import json
import re

from google import genai

from app.config import HISTORY_JSON_PATH, TARGET_TICKERS, get_settings
from app.notifiers.telegram_notifier import send_telegram_message
from app.storage.trade_history import TradeHistory
from app.trading.exchange_client import ExchangeClient, MarketSnapshot
from app.trading.strategy_prompt import build_prompt
from app.utils.logger import setup_logger

logger = setup_logger(__name__)


def _parse_gemini_response(text: str) -> dict:
    """Gemini 응답에서 JSON 블록을 추출한다. 파싱 실패 시 HOLD 기본값 반환."""
    cleaned = re.sub(r"```(?:json)?|```", "", text).strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        logger.warning("JSON parse failed; defaulting to HOLD. raw=%r", text[:200])
        return {
            "target_ticker": None,
            "decision": "HOLD",
            "amount_krw": 5000,
            "reason": "응답 파싱 실패",
        }


def _call_gemini(api_key: str, model: str, prompt: str) -> dict:
    """Gemini API 1-Turn 호출 후 투자 판정 dict 반환."""
    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model=model,
        contents=prompt,
    )
    raw_text = response.text or ""
    logger.info("Gemini raw response: %s", raw_text[:300])
    return _parse_gemini_response(raw_text)


def _build_report(snapshots: list[MarketSnapshot], decision: dict, order_result) -> str:
    target_ticker = decision.get("target_ticker") or "?"
    action = decision.get("decision", "HOLD")
    reason = decision.get("reason", "")

    order_status = "주문 없음"
    if order_result is not None:
        order_status = f"체결 완료 (uuid: {order_result.get('uuid', '?')})"
    elif action != "HOLD":
        order_status = "주문 조건 미충족으로 스킵"

    market_lines = []
    for snap in snapshots:
        marker = " ★" if snap.ticker == target_ticker else "  "
        market_lines.append(
            f"{marker}{snap.ticker}: {snap.current_price:,.0f} KRW"
            f" | RSI={snap.rsi14} | MA20={snap.ma20:,.0f}"
        )

    krw = snapshots[0].krw_balance if snapshots else 0.0
    market_summary = "\n".join(market_lines)

    return (
        f"[Crypto Trading Agent]\n"
        f"======================\n"
        f"{market_summary}\n"
        f"KRW 잔고: {krw:,.0f} 원\n"
        f"\n"
        f"★ 판정: {target_ticker} {action}\n"
        f"근거: {reason}\n"
        f"\n"
        f"주문 상태: {order_status}"
    )


def run() -> int:
    logger.info("Crypto Trading Agent started")

    try:
        settings = get_settings()
    except ValueError as exc:
        logger.error("%s", exc)
        return 1

    # Step 1: 3대장 시장 스냅샷 수집
    client = ExchangeClient(settings.upbit_access_key, settings.upbit_secret_key)
    snapshots = client.get_market_snapshots()
    if not snapshots:
        logger.error("all market snapshots failed; aborting")
        return 1

    # Step 2: Gemini 1-Turn 판정
    prompt = build_prompt(snapshots)
    try:
        decision = _call_gemini(settings.gemini_api_key, settings.gemini_model, prompt)
    except Exception as exc:
        logger.error("Gemini call failed: %s", exc)
        return 1

    target_ticker = decision.get("target_ticker")
    action = decision.get("decision", "HOLD").upper()
    logger.info("Gemini decision: %s %s", action, target_ticker)

    # Step 3: 주문 집행 (5,000원 물리 락은 ExchangeClient 기본값으로 강제)
    order_result = None
    if action in ("BUY", "SELL") and target_ticker:
        if target_ticker not in TARGET_TICKERS:
            logger.warning("invalid target_ticker from Gemini: %s", target_ticker)
        elif action == "BUY":
            order_result = client.buy_market_order(target_ticker)
        elif action == "SELL":
            order_result = client.sell_market_order(target_ticker)

    # Step 4: 텔레그램 리포트
    report = _build_report(snapshots, decision, order_result)
    ok = send_telegram_message(settings.telegram_bot_token, settings.telegram_chat_id, report)
    if not ok:
        logger.error("Telegram delivery failed")

    # Step 5: 매매 일지 기록
    target_snap = next((s for s in snapshots if s.ticker == target_ticker), None)
    history = TradeHistory(HISTORY_JSON_PATH)
    history.append({
        "date": __import__("datetime").datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
        "ticker": target_ticker,
        "action": action,
        "avg_buy_price": target_snap.coin_avg_buy_price if target_snap else None,
        "coin_volume": target_snap.coin_balance if target_snap else None,
        "reason": decision.get("reason"),
        "price": target_snap.current_price if target_snap else None,
        "rsi14": target_snap.rsi14 if target_snap else None,
        "ma20": target_snap.ma20 if target_snap else None,
        "krw_balance": snapshots[0].krw_balance if snapshots else None,
        "order_uuid": order_result.get("uuid") if isinstance(order_result, dict) else None,
    })

    logger.info("Crypto Trading Agent finished (action=%s ticker=%s)", action, target_ticker)
    return 0


if __name__ == "__main__":
    raise SystemExit(run())
