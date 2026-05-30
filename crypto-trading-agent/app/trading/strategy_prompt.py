"""Gemini 투자 판단용 페르소나 주입 프롬프트 빌더."""

from __future__ import annotations

from app.trading.exchange_client import MarketSnapshot

_SYSTEM_PERSONA = """\
당신은 윌리엄 오닐(William O'Neil)의 추세 매매 철학과 철저한 리스크 관리를 체화한 퀀트 트레이더입니다.
핵심 원칙: 추세를 따르고, 손실은 빠르게 끊고, 데이터만을 근거로 냉정하게 판단합니다.
아래 3대장 시장 데이터를 분석하여 가장 유리한 종목 1개를 선택하거나, 유리한 종목이 없으면 HOLD를 반환합니다.
"""

_RESPONSE_FORMAT = """\
반드시 아래 JSON 형식만 출력하세요. 설명, 마크다운, 코드블록 없이 순수 JSON만 반환합니다:

{
  "target_ticker": "KRW-BTC" | "KRW-ETH" | "KRW-SOL",
  "decision": "BUY" | "SELL" | "HOLD",
  "amount_krw": 5000,
  "reason": "판단 근거 (한국어, 2~3문장, 텔레그램 전송용)"
}
"""


def _format_snapshot(snap: MarketSnapshot) -> str:
    coin_symbol = snap.ticker.split("-")[1]
    trend = "현재가 > MA20 (상승세)" if snap.current_price > snap.ma20 else "현재가 < MA20 (하락세)"
    rsi_label = "과매수" if snap.rsi14 >= 70 else ("과매도" if snap.rsi14 <= 30 else "중립")

    unrealized_pnl = ""
    if snap.coin_balance > 0 and snap.coin_avg_buy_price > 0:
        pnl_pct = (snap.current_price - snap.coin_avg_buy_price) / snap.coin_avg_buy_price * 100
        unrealized_pnl = f"\n- 미실현손익: {pnl_pct:+.2f}%"

    return (
        f"[{snap.ticker}]\n"
        f"- 현재가: {snap.current_price:,.0f} KRW\n"
        f"- MA20: {snap.ma20:,.0f} KRW  ({trend})\n"
        f"- RSI(14): {snap.rsi14}  ({rsi_label})\n"
        f"- 24h 거래량: {snap.volume_24h:.2f} {coin_symbol}\n"
        f"- 보유량: {snap.coin_balance:.6f} {coin_symbol}\n"
        f"- 평균 매수가: {snap.coin_avg_buy_price:,.0f} KRW"
        f"{unrealized_pnl}"
    )


def build_prompt(snapshots: list[MarketSnapshot]) -> str:
    """MarketSnapshot 목록을 압축 포맷으로 직렬화해 Gemini 프롬프트를 반환한다."""
    krw_balance = snapshots[0].krw_balance if snapshots else 0.0
    account_info = f"[내 계좌]\n- KRW 잔고: {krw_balance:,.0f} 원"

    market_sections = "\n\n".join(_format_snapshot(s) for s in snapshots)

    return (
        f"{_SYSTEM_PERSONA}\n"
        f"{account_info}\n\n"
        f"[시장 데이터]\n"
        f"{market_sections}\n\n"
        f"{_RESPONSE_FORMAT}"
    )
