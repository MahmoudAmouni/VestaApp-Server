import { fetchJson } from "../../api/http";
import type { ApiResponse } from "../rooms/rooms.types";
import type {
  ShoppingListItem,
  ShoppingListItemRaw,
  ShoppingListItemWriteDto,
  ShoppingListResponseRaw,
} from "./shoppingList.types";
import { mapShoppingListItem } from "./shoppingList.types";

type ShoppingListItemResponseRaw = ApiResponse<{
  shopping_list_item?: ShoppingListItemRaw;
  shopping_list_items?: ShoppingListItemRaw[];
}>;

function pickReturnedItem(
  res: ShoppingListItemResponseRaw
): ShoppingListItemRaw | null {
  if (res.data?.shopping_list_item) return res.data.shopping_list_item;
  const arr = res.data?.shopping_list_items;
  return Array.isArray(arr) && arr.length ? arr[0] : null;
}

export async function apiGetShoppingList(params: {
  homeId: number;
  token?: string;
  signal?: AbortSignal;
}): Promise<ShoppingListItem[]> {
  const { homeId, token, signal } = params;

  const res = await fetchJson<ShoppingListResponseRaw>(
    `/shoppinglist/${homeId}`,
    {
      method: "GET",
      token,
      signal,
    }
  );

  if (!res.success)
    throw new Error(res.message || "Shopping list failed to load.");

  const raw = Array.isArray(res.data?.shopping_list_items)
    ? res.data.shopping_list_items
    : [];

  return raw.map(mapShoppingListItem);
}

export async function apiCreateShoppingListItem(params: {
  homeId: number;
  body: ShoppingListItemWriteDto;
  token?: string;
  signal?: AbortSignal;
}): Promise<ShoppingListItem | null> {
  const { homeId, body, token, signal } = params;

  const res = await fetchJson<ShoppingListItemResponseRaw>(
    `/shoppinglist/${homeId}`,
    {
      method: "POST",
      token,
      signal,
      body,
    }
  );

  if (!res.success)
    throw new Error(res.message || "Failed to create shopping list item.");

  const createdRaw = pickReturnedItem(res);
  return createdRaw ? mapShoppingListItem(createdRaw) : null;
}

export async function apiUpdateShoppingListItem(params: {
  homeId: number;
  shoppingListItemId: number;
  body: ShoppingListItemWriteDto;
  token?: string;
  signal?: AbortSignal;
}): Promise<ShoppingListItem | null> {
  const { homeId, shoppingListItemId, body, token, signal } = params;

  const res = await fetchJson<ShoppingListItemResponseRaw>(
    `/shoppinglist/${homeId}/${shoppingListItemId}`,
    { method: "POST", token, signal, body }
  );

  if (!res.success)
    throw new Error(res.message || "Failed to update shopping list item.");

  const updatedRaw = pickReturnedItem(res);
  return updatedRaw ? mapShoppingListItem(updatedRaw) : null;
}

export async function apiDeleteShoppingListItem(params: {
  homeId: number;
  shoppingListItemId: number;
  token?: string;
  signal?: AbortSignal;
}): Promise<void> {
  const { homeId, shoppingListItemId, token, signal } = params;

  const res = await fetchJson<ApiResponse<unknown>>(
    `/shoppinglist/${homeId}/${shoppingListItemId}`,
    { method: "GET", token, signal }
  );

  if (!res.success)
    throw new Error(res.message || "Failed to delete shopping list item.");
}
