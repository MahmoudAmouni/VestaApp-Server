import type { ApiResponse } from "../rooms/rooms.types";

export type ShoppingNamedEntity = { name: string };

export type ShoppingListItem = {
  id: number;

  item_name: ShoppingNamedEntity;
  unit: ShoppingNamedEntity;

  quantity: number;
  is_checked: boolean;
};

export type ShoppingListResponseRaw = ApiResponse<{
  shopping_list_items: ShoppingListItemRaw[];
}>;

export type ShoppingListItemWriteDto = {
  item_name: string; 
  unit: string; 
  quantity: number; 
  is_checked: boolean | null; 
};

export type ShoppingListItemPatch = Partial<ShoppingListItemWriteDto>;

export type ShoppingNamedEntityRaw = {
  id: number;
  name: string;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
};

export type ShoppingListItemRaw = {
  id: number;

  home_id?: number;
  item_id?: number;
  unit_id?: number;

  quantity: number;
  is_checked: boolean;

  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;

  item_name?: ShoppingNamedEntityRaw;
  unit?: ShoppingNamedEntityRaw;
};

export function mapShoppingListItem(
  raw: ShoppingListItemRaw
): ShoppingListItem {
  const itemName = raw.item_name?.name;
  const unitName = raw.unit?.name;

  if (!itemName) {
    throw new Error(
      "Shopping list item missing item_name.name from API response."
    );
  }
  if (!unitName) {
    throw new Error("Shopping list item missing unit.name from API response.");
  }

  return {
    id: raw.id,
    item_name: { name: itemName },
    unit: { name: unitName },
    quantity: raw.quantity,
    is_checked: Boolean(raw.is_checked),
  };
}
