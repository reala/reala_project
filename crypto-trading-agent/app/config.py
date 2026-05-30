import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

PROJECT_ROOT = Path(__file__).resolve().parent.parent
HISTORY_JSON_PATH = PROJECT_ROOT / "data" / "history.json"

TELEGRAM_MAX_CHARS = 4096

# 업비트 주문 단위 설정
TRADE_AMOUNT_KRW = 5_000  # 소액 테스트 매매 금액 (원)
TARGET_TICKERS = ["KRW-BTC", "KRW-ETH", "KRW-SOL"]  # 3대장


@dataclass(frozen=True)
class Settings:
    gemini_api_key: str
    gemini_model: str
    telegram_bot_token: str
    telegram_chat_id: str
    upbit_access_key: str
    upbit_secret_key: str


def get_settings() -> Settings:
    missing = []
    gemini_api_key = os.getenv("GEMINI_API_KEY", "").strip()
    gemini_model = os.getenv("GEMINI_MODEL", "gemini-2.0-flash").strip() or "gemini-2.0-flash"
    telegram_bot_token = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
    telegram_chat_id = os.getenv("TELEGRAM_CHAT_ID", "").strip()
    upbit_access_key = os.getenv("UPBIT_ACCESS_KEY", "").strip()
    upbit_secret_key = os.getenv("UPBIT_SECRET_KEY", "").strip()

    if not gemini_api_key:
        missing.append("GEMINI_API_KEY")
    if not telegram_bot_token:
        missing.append("TELEGRAM_BOT_TOKEN")
    if not telegram_chat_id:
        missing.append("TELEGRAM_CHAT_ID")
    if not upbit_access_key:
        missing.append("UPBIT_ACCESS_KEY")
    if not upbit_secret_key:
        missing.append("UPBIT_SECRET_KEY")

    if missing:
        raise ValueError(
            f"Missing required environment variables: {', '.join(missing)}. "
            "Copy .env and set values, or configure GitHub Secrets."
        )

    return Settings(
        gemini_api_key=gemini_api_key,
        gemini_model=gemini_model,
        telegram_bot_token=telegram_bot_token,
        telegram_chat_id=telegram_chat_id,
        upbit_access_key=upbit_access_key,
        upbit_secret_key=upbit_secret_key,
    )
