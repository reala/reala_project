import json
import subprocess
from datetime import datetime
from pathlib import Path

from app.utils.logger import setup_logger

logger = setup_logger(__name__)


class TradeHistory:
    """data/history.json 기반 매매 일지 기록 및 자율 깃 커밋 관리.

    ai-release-radar의 SeenStore 패턴을 변형하여,
    매 거래마다 결과 레코드를 append하고 깃에 자동 커밋한다.
    """

    def __init__(self, path: Path) -> None:
        self.path = path

    def load(self) -> list[dict]:
        if not self.path.exists():
            logger.info("history.json not found; creating empty store at %s", self.path)
            self.path.parent.mkdir(parents=True, exist_ok=True)
            self.save([])
            return []

        try:
            with self.path.open("r", encoding="utf-8") as f:
                data = json.load(f)
            if isinstance(data, list):
                return data
        except (json.JSONDecodeError, OSError) as exc:
            logger.warning("failed to load history.json (%s); starting fresh", exc)

        return []

    def save(self, records: list[dict]) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        with self.path.open("w", encoding="utf-8") as f:
            json.dump(records, f, ensure_ascii=False, indent=2)

    def append(self, record: dict) -> None:
        """매매 결과 레코드를 history.json에 추가하고 깃 커밋한다."""
        records = self.load()
        record.setdefault("timestamp", datetime.utcnow().isoformat() + "Z")
        records.append(record)
        self.save(records)
        logger.info("trade record saved: %s", record.get("action", "?"))
        self._git_commit()

    def _git_commit(self) -> None:
        """CI 환경에서 history.json 변경분을 자동 커밋한다."""
        try:
            subprocess.run(
                ["git", "config", "user.name", "github-actions[bot]"],
                check=True, capture_output=True,
            )
            subprocess.run(
                ["git", "config", "user.email", "github-actions[bot]@users.noreply.github.com"],
                check=True, capture_output=True,
            )
            subprocess.run(
                ["git", "add", str(self.path)],
                check=True, capture_output=True,
            )
            result = subprocess.run(
                ["git", "diff", "--cached", "--quiet"],
                capture_output=True,
            )
            if result.returncode != 0:
                subprocess.run(
                    ["git", "commit", "-m", "chore: update history.json [skip ci]"],
                    check=True, capture_output=True,
                )
                subprocess.run(["git", "push"], check=True, capture_output=True)
                logger.info("history.json committed and pushed")
            else:
                logger.info("history.json: no changes to commit")
        except subprocess.CalledProcessError as exc:
            logger.warning("git commit failed (non-CI environment?): %s", exc)
