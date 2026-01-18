from __future__ import annotations

from typing import Optional
from pydantic import BaseModel, Field


class AddItemArgs(BaseModel):
    item_name: str = Field(..., description="Item name, e.g. 'Milk'")
    unit: str = Field(..., description="Unit, e.g. 'pcs', 'liters'")
    quantity: int = Field(..., ge=1, description="Quantity (integer >= 1)")
    is_checked: bool = Field(False, description="Whether the item is already checked")


class UpdateItemArgs(BaseModel):
    item_id: int = Field(..., description="Shopping list item id to update")
    item_name: str = Field(..., description="New item name")
    unit: str = Field(..., description="New unit")
    quantity: int = Field(..., ge=1, description="New quantity")
    is_checked: Optional[bool] = Field(None, description="Optional checked state")


class DeleteItemArgs(BaseModel):
    item_id: int = Field(..., description="Shopping list item id to delete")
    confirm: bool = Field(False, description="Must be true to actually delete")


class AddPantryItemArgs(BaseModel):
    item_name: str = Field(..., description="Item name, e.g. 'Milk'")
    quantity: int = Field(..., ge=1, description="Quantity (integer >= 1)")
    unit: Optional[str] = Field(None, description="Unit, e.g. 'pcs', 'liters'")
    location: Optional[str] = Field(None, description="Location, e.g. 'Fridge', 'Pantry'")
    expiry_date: Optional[str] = Field(
        None, description="Expiry date in format 'YYYY-MM-DD'"
    )


class UpdatePantryItemArgs(BaseModel):
    item_id: int = Field(..., description="Pantry item id to update")
    item_name: str = Field(..., description="New item name")
    quantity: int = Field(..., ge=1, description="New quantity")
    unit: Optional[str] = Field(None, description="New unit")
    location: Optional[str] = Field(None, description="New location")
    expiry_date: Optional[str] = Field(None, description="New expiry date 'YYYY-MM-DD'")


class DeletePantryItemArgs(BaseModel):
    item_id: int = Field(..., description="Pantry item id to delete")
    confirm: bool = Field(False, description="Must be true to actually delete")
