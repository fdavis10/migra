"""In-memory ring buffer for recent application log records."""

from __future__ import annotations

import logging
import threading
from collections import deque
from datetime import datetime, timezone


_MAX_RECORDS = 400
_lock = threading.Lock()
_buffer: deque[dict] = deque(maxlen=_MAX_RECORDS)


class RingBufferHandler(logging.Handler):
    """Keeps the latest log lines for the technical logs panel."""

    def emit(self, record: logging.LogRecord) -> None:
        try:
            entry = {
                "ts": datetime.fromtimestamp(record.created, tz=timezone.utc).isoformat(),
                "level": record.levelname,
                "logger": record.name,
                "message": self.format(record) if self.formatter else record.getMessage(),
            }
            if record.exc_info:
                entry["exc"] = self.formatException(record.exc_info)
            with _lock:
                _buffer.append(entry)
        except Exception:  # noqa: BLE001 — never break logging
            self.handleError(record)


def get_recent_logs(limit: int = 200, level: str | None = None) -> list[dict]:
    with _lock:
        rows = list(_buffer)
    if level:
        level_u = level.upper()
        rows = [r for r in rows if r["level"] == level_u]
    if limit and len(rows) > limit:
        rows = rows[-limit:]
    return list(reversed(rows))


def push_system_event(level: str, message: str, logger_name: str = "apps.panel.tech") -> None:
    entry = {
        "ts": datetime.now(tz=timezone.utc).isoformat(),
        "level": level.upper(),
        "logger": logger_name,
        "message": message,
    }
    with _lock:
        _buffer.append(entry)
