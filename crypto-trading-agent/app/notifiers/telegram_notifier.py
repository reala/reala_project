import requests

from app.config import TELEGRAM_MAX_CHARS
from app.utils.logger import setup_logger

logger = setup_logger(__name__)

REQUEST_TIMEOUT = 30


def split_message(text: str, max_len: int = TELEGRAM_MAX_CHARS) -> list[str]:
    if len(text) <= max_len:
        return [text]

    chunks: list[str] = []
    remaining = text
    while remaining:
        if len(remaining) <= max_len:
            chunks.append(remaining)
            break
        split_at = remaining.rfind("\n", 0, max_len)
        if split_at < max_len // 2:
            split_at = max_len
        chunks.append(remaining[:split_at].rstrip())
        remaining = remaining[split_at:].lstrip()

    return chunks


def send_telegram_message(bot_token: str, chat_id: str, text: str) -> bool:
    """Send a text message to a Telegram chat via the Bot API.

    Automatically splits messages longer than 4096 characters into sequential chunks
    to stay within Telegram's per-message character limit.

    Args:
        bot_token: Telegram Bot API token (format: "123456789:ABC-DEFxyz...").
        chat_id: Target chat or channel ID (numeric string or @username).
        text: Message text to deliver. Plain text only.

    Returns:
        True if every chunk was delivered successfully; False if any chunk failed.
    """
    api_url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    chunks = split_message(text)
    all_ok = True

    for index, chunk in enumerate(chunks, start=1):
        try:
            response = requests.post(
                api_url,
                json={
                    "chat_id": chat_id,
                    "text": chunk,
                    "disable_web_page_preview": True,
                },
                timeout=REQUEST_TIMEOUT,
            )
            response.raise_for_status()
            body = response.json()
            if not body.get("ok"):
                logger.error(
                    "Telegram API returned error for chunk %d/%d: %s",
                    index,
                    len(chunks),
                    body,
                )
                all_ok = False
            else:
                logger.info("Telegram message sent (chunk %d/%d)", index, len(chunks))
        except requests.RequestException as exc:
            logger.error(
                "failed to send Telegram chunk %d/%d: %s",
                index,
                len(chunks),
                exc,
            )
            all_ok = False

    return all_ok
