"""업비트 연동 클라이언트 — 잔고 조회, 기술적 지표 산출, 주문 집행."""

from __future__ import annotations

import math
from dataclasses import dataclass

import pandas as pd
import pyupbit

from app.config import TARGET_TICKERS, TRADE_AMOUNT_KRW
from app.utils.logger import setup_logger

logger = setup_logger(__name__)


@dataclass
class MarketSnapshot:
    """Gemini에 넘길 시장 데이터 압축 구조체."""

    ticker: str
    current_price: float
    ma20: float
    rsi14: float
    volume_24h: float
    krw_balance: float
    coin_balance: float        # 해당 코인 보유량
    coin_avg_buy_price: float  # 해당 코인 평균 매수가


class ExchangeClient:
    """pyupbit 기반 업비트 클라이언트.

    인증 없이도 시세 조회는 가능하며, 주문 집행에만 access/secret 키가 필요하다.
    """

    def __init__(self, access_key: str, secret_key: str) -> None:
        self._upbit = pyupbit.Upbit(access_key, secret_key)
        logger.info("ExchangeClient initialised (tickers=%s)", TARGET_TICKERS)

    # ------------------------------------------------------------------
    # 잔고 조회
    # ------------------------------------------------------------------

    def get_krw_balance(self) -> float:
        """원화 잔고(KRW) 반환."""
        try:
            balance = self._upbit.get_balance("KRW")
            return float(balance) if balance is not None else 0.0
        except Exception as exc:
            logger.error("get_krw_balance failed: %s", exc)
            return 0.0

    def get_coin_balance(self, ticker: str) -> tuple[float, float]:
        """(코인 보유량, 평균 매수가) 반환."""
        try:
            balance = self._upbit.get_balance(ticker)
            avg_price = self._upbit.get_avg_buy_price(ticker)
            return (
                float(balance) if balance is not None else 0.0,
                float(avg_price) if avg_price is not None else 0.0,
            )
        except Exception as exc:
            logger.error("get_coin_balance(%s) failed: %s", ticker, exc)
            return 0.0, 0.0

    # ------------------------------------------------------------------
    # 시세 및 기술적 지표
    # ------------------------------------------------------------------

    def get_current_price(self, ticker: str) -> float:
        """현재가(KRW) 반환."""
        try:
            price = pyupbit.get_current_price(ticker)
            return float(price) if price is not None else 0.0
        except Exception as exc:
            logger.error("get_current_price(%s) failed: %s", ticker, exc)
            return 0.0

    def get_ohlcv(self, ticker: str, count: int = 30) -> pd.DataFrame | None:
        """일봉 OHLCV 데이터 반환 (최근 count 개).

        Returns:
            columns: open, high, low, close, volume
            None if fetch fails.
        """
        try:
            df = pyupbit.get_ohlcv(ticker, interval="day", count=count)
            if df is None or df.empty:
                logger.error("get_ohlcv(%s) returned empty dataframe", ticker)
                return None
            return df
        except Exception as exc:
            logger.error("get_ohlcv(%s) failed: %s", ticker, exc)
            return None

    @staticmethod
    def calc_rsi(df: pd.DataFrame, period: int = 14) -> float:
        """Wilder RSI 계산. 데이터 부족 시 50.0(중립) 반환."""
        if len(df) < period + 1:
            return 50.0

        delta = df["close"].diff()
        gain = delta.clip(lower=0)
        loss = -delta.clip(upper=0)

        avg_gain = gain.ewm(com=period - 1, min_periods=period).mean()
        avg_loss = loss.ewm(com=period - 1, min_periods=period).mean()

        last_gain = float(avg_gain.iloc[-1])
        last_loss = float(avg_loss.iloc[-1])

        if math.isnan(last_gain) or math.isnan(last_loss):
            return 50.0
        if last_loss == 0:
            return 100.0 if last_gain > 0 else 50.0

        rs = last_gain / last_loss
        return round(100 - (100 / (1 + rs)), 2)

    @staticmethod
    def calc_ma(df: pd.DataFrame, period: int = 20) -> float:
        """단순이동평균(MA) 계산. 데이터 부족 시 현재 종가 반환."""
        if len(df) < period:
            return float(df["close"].iloc[-1])
        return round(float(df["close"].rolling(period).mean().iloc[-1]), 0)

    def get_market_snapshot(self, ticker: str, krw_balance: float) -> MarketSnapshot | None:
        """단일 티커의 MarketSnapshot 반환. KRW 잔고는 외부에서 주입(중복 조회 방지)."""
        df = self.get_ohlcv(ticker, count=30)
        if df is None:
            return None

        current_price = self.get_current_price(ticker)
        ma20 = self.calc_ma(df, 20)
        rsi14 = self.calc_rsi(df, 14)
        volume_24h = round(float(df["volume"].iloc[-1]), 4)
        coin_balance, coin_avg_buy = self.get_coin_balance(ticker)

        snapshot = MarketSnapshot(
            ticker=ticker,
            current_price=current_price,
            ma20=ma20,
            rsi14=rsi14,
            volume_24h=volume_24h,
            krw_balance=krw_balance,
            coin_balance=coin_balance,
            coin_avg_buy_price=coin_avg_buy,
        )
        logger.info(
            "[%s] price=%.0f RSI=%.1f MA20=%.0f KRW=%.0f COIN=%.6f",
            ticker, current_price, rsi14, ma20, krw_balance, coin_balance,
        )
        return snapshot

    def get_market_snapshots(self) -> list[MarketSnapshot]:
        """3대장 전체 MarketSnapshot 목록 반환. KRW 잔고는 1회만 조회한다.

        실패한 티커는 목록에서 제외된다.
        """
        krw_balance = self.get_krw_balance()
        snapshots: list[MarketSnapshot] = []
        for ticker in TARGET_TICKERS:
            snap = self.get_market_snapshot(ticker, krw_balance)
            if snap is not None:
                snapshots.append(snap)
        return snapshots

    # ------------------------------------------------------------------
    # 주문 집행
    # ------------------------------------------------------------------

    def buy_market_order(self, ticker: str, amount_krw: float = TRADE_AMOUNT_KRW) -> dict | None:
        """시장가 매수. 잔고 부족 시 None 반환."""
        krw = self.get_krw_balance()
        if krw < amount_krw:
            logger.warning(
                "buy skipped [%s]: KRW balance %.0f < required %.0f", ticker, krw, amount_krw
            )
            return None

        try:
            result = self._upbit.buy_market_order(ticker, amount_krw)
            logger.info("BUY order placed [%s]: %s", ticker, result)
            return result
        except Exception as exc:
            logger.error("buy_market_order(%s) failed: %s", ticker, exc)
            return None

    def sell_market_order(self, ticker: str, volume: float | None = None) -> dict | None:
        """시장가 매도. volume=None 이면 전량 매도.

        매도 가능 잔고가 최소 주문 금액(5,000원) 미만이면 스킵한다.
        """
        coin_balance, _ = self.get_coin_balance(ticker)
        sell_volume = volume if volume is not None else coin_balance

        if sell_volume <= 0:
            logger.warning("sell skipped [%s]: no coin balance", ticker)
            return None

        current_price = self.get_current_price(ticker)
        if current_price * sell_volume < 5_000:
            logger.warning(
                "sell skipped [%s]: value %.0f KRW < minimum 5000",
                ticker, current_price * sell_volume,
            )
            return None

        try:
            result = self._upbit.sell_market_order(ticker, sell_volume)
            logger.info("SELL order placed [%s]: %s", ticker, result)
            return result
        except Exception as exc:
            logger.error("sell_market_order(%s) failed: %s", ticker, exc)
            return None
