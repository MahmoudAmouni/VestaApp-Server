from __future__ import annotations

from typing import Any, Dict

from ..clients.laravel_client import LaravelClient
from ..exceptions import UpstreamError


class IotApiService:

    def __init__(self, client: LaravelClient):
        self._client = client

    def turn_on(self) -> Dict[str, Any]:
        resp = self._client.post("esp/on", json_body={})
        return self._handle(resp)

    def turn_off(self) -> Dict[str, Any]:
        resp = self._client.post("esp/off", json_body={})
        return self._handle(resp)

    @staticmethod
    def _handle(resp) -> Dict[str, Any]:
        try:
            payload = resp.json()
        except Exception:
            payload = {"raw": resp.text}

        if resp.status_code >= 400:
            raise UpstreamError(f"Laravel error ({resp.status_code}): {payload}")

        return payload
