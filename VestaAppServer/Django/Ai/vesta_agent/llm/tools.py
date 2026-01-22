from __future__ import annotations

from typing import Any, Dict, List, Optional

from langchain_core.tools import tool

from .schemas import (
    AddItemArgs,
    UpdateItemArgs,
    DeleteItemArgs,
    AddPantryItemArgs,
    UpdatePantryItemArgs,
    DeletePantryItemArgs,
)
from ..services.shoppinglist_service import ShoppingListApiService
from ..services.pantry_service import PantryApiService
from ..services.iot_service import IotApiService



def build_shopping_tools(shopping_api: ShoppingListApiService):
    """Build LangChain tools for shopping list."""

    @tool(args_schema=AddItemArgs)
    def shoppinglist_add(
        item_name: str, unit: str, quantity: int, is_checked: bool = False
    ) -> Dict[str, Any]:
        """Add an item to the shopping list."""
        return shopping_api.create_item(
            item_name=item_name, unit=unit, quantity=quantity, is_checked=is_checked
        )

    @tool
    def shoppinglist_list() -> Dict[str, Any]:
        """List shopping list items."""
        return shopping_api.list_items()

    @tool(args_schema=UpdateItemArgs)
    def shoppinglist_update(
        item_id: int,
        item_name: str,
        unit: str,
        quantity: int,
        is_checked: Optional[bool] = None,
    ) -> Dict[str, Any]:
        """Update an existing shopping list item."""
        return shopping_api.update_item(
            item_id=item_id,
            item_name=item_name,
            unit=unit,
            quantity=quantity,
            is_checked=is_checked,
        )

    @tool(args_schema=DeleteItemArgs)
    def shoppinglist_delete(item_id: int, confirm: bool = False) -> Dict[str, Any]:
        """Delete an item from shopping list. Requires confirm=true."""
        if not confirm:
            return {
                "error": "Deletion requires confirm=true. Ask the user to confirm first."
            }
        return shopping_api.delete_item(item_id=item_id)

    return [shoppinglist_list, shoppinglist_add, shoppinglist_update, shoppinglist_delete]


def build_pantry_tools(pantry_api: PantryApiService):
    """Build LangChain tools for pantry."""

    @tool
    def pantry_list() -> Dict[str, Any]:
        """List pantry items."""
        return pantry_api.list_items()

    @tool(args_schema=AddPantryItemArgs)
    def pantry_add(
        item_name: str,
        quantity: int,
        unit: Optional[str] = None,
        location: Optional[str] = None,
        expiry_date: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Add an item to the pantry."""
        return pantry_api.create_item(
            item_name=item_name,
            quantity=quantity,
            unit=unit,
            location=location,
            expiry_date=expiry_date,
        )

    @tool(args_schema=UpdatePantryItemArgs)
    def pantry_update(
        item_id: int,
        item_name: str,
        quantity: int,
        unit: Optional[str] = None,
        location: Optional[str] = None,
        expiry_date: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Update an existing pantry item."""
        return pantry_api.update_item(
            item_id=item_id,
            item_name=item_name,
            quantity=quantity,
            unit=unit,
            location=location,
            expiry_date=expiry_date,
        )

    @tool(args_schema=DeletePantryItemArgs)
    def pantry_delete(item_id: int, confirm: bool = False) -> Dict[str, Any]:
        """Delete an item from pantry. Requires confirm=true."""
        if not confirm:
            return {
                "error": "Deletion requires confirm=true. Ask the user to confirm first."
            }
        return pantry_api.delete_item(item_id=item_id)

    return [pantry_list, pantry_add, pantry_update, pantry_delete]


def build_iot_tools(iot_api: IotApiService):
    """Build LangChain tools for IOT control."""

    @tool
    def turn_on_device() -> Dict[str, Any]:
        """Turn on the IOT device. Use this tool when the user asks to turn on the lamp, light, device, or similar."""
        return iot_api.turn_on()

    @tool
    def turn_off_device() -> Dict[str, Any]:
        """Turn off the IOT device. Use this tool when the user asks to turn off the lamp, light, device, or similar."""
        return iot_api.turn_off()

    return [turn_on_device, turn_off_device]
