from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

import httpx
from django.conf import settings

@dataclass(frozen=True)
class LLMConfig:
    base_url: str
    api_key: str
    model: str
    timeout_seconds: int

class LLMService:

    def __init__(self):
        self._cfg = LLMConfig(
            base_url=settings.LLM_BASE_URL,
            api_key=settings.LLM_API_KEY,
            model=settings.LLM_MODEL,
            timeout_seconds=settings.LLM_TIMEOUT_SECONDS,
        )

    def is_configured(self) -> bool:
        return bool(self._cfg.base_url and self._cfg.model)

    def chat(self, system: str, user: str) -> str:
        if not self.is_configured():
            raise RuntimeError("LLM is not configured. Set LLM_BASE_URL and LLM_MODEL (and LLM_API_KEY if needed).")

        headers = {"Content-Type": "application/json"}
        if self._cfg.api_key:
            headers["Authorization"] = f"Bearer {self._cfg.api_key}"

        url = self._cfg.base_url.rstrip("/") + "/v1/chat/completions"

        payload = {
            "model": self._cfg.model,
            "messages": [
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            "temperature": 0.2,
        }

        with httpx.Client(timeout=self._cfg.timeout_seconds) as client:
            resp = client.post(url, headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()
            return data["choices"][0]["message"]["content"]
