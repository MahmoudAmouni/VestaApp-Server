from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Any, Dict, Optional

import httpx
from django.conf import settings


@dataclass(frozen=True)
class LaravelClient:
    """Thin HTTP client for the Laravel API."""

    base_url: str
    token: str
    timeout_seconds: float

    @classmethod
    def from_settings(cls, token: str) -> "LaravelClient":
        return cls(
            base_url=settings.LARAVEL_BASE_URL,
            token=token,
            timeout_seconds=settings.LARAVEL_TIMEOUT_SECONDS,
        )

    def _headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.token}",
            "Accept": "application/json",
            "Content-Type": "application/json",
        }

    def get(self, path: str, params: Optional[Dict[str, Any]] = None) -> httpx.Response:
        with httpx.Client(timeout=self.timeout_seconds) as client:
            return client.get(self._url(path), headers=self._headers(), params=params)

    def post(self, path: str, json_body: Dict[str, Any]) -> httpx.Response:
        with httpx.Client(timeout=self.timeout_seconds) as client:
            return client.post(self._url(path), headers=self._headers(), content=json.dumps(json_body))

    def _url(self, path: str) -> str:
        return f"{self.base_url.rstrip('/')}/{path.lstrip('/')}"
