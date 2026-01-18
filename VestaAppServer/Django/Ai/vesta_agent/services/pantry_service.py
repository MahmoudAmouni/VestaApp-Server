from __future__ import annotations

from typing import Any, Dict, Optional

from ..clients.laravel_client import LaravelClient
from ..exceptions import UpstreamError


class PantryApiService:


    def __init__(self, client: LaravelClient, home_id: int):

        self._client = client
        self._home_id = home_id

    def list_items(self) -> Dict[str, Any]:

        resp = self._client.get(f"pantry/{self._home_id}")
        return self._handle(resp)

    def create_item(
        self,
        *,
        item_name: str,
        quantity: int,
        unit: Optional[str] = None,
        location: Optional[str] = None,
        expiry_date: Optional[str] = None,
    ) -> Dict[str, Any]:

        payload = {
            "item_name": item_name,
            "quantity": quantity,
        }
        if unit:
            payload["unit"] = unit
        if location:
            payload["location"] = location
        if expiry_date:
            payload["expiry_date"] = expiry_date

        resp = self._client.post(f"pantry/{self._home_id}", json_body=payload)
        return self._handle(resp)

    def update_item(
        self,
        *,
        item_id: int,
        item_name: str,
        quantity: int,
        unit: Optional[str] = None,
        location: Optional[str] = None,
        expiry_date: Optional[str] = None,
    ) -> Dict[str, Any]:
        
        payload = {
            "item_name": item_name,
            "quantity": quantity,
        }
        if unit:
            payload["unit"] = unit
        if location:
            payload["location"] = location
        if expiry_date:
            payload["expiry_date"] = expiry_date

        resp = self._client.post(f"pantry/{self._home_id}/{item_id}", json_body=payload)
        return self._handle(resp)

    def delete_item(self, *, item_id: int) -> Dict[str, Any]:

        resp = self._client.get(f"pantry/{self._home_id}/{item_id}")
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
