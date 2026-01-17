import { fetchJson } from "../../api/http";
import type { ApiResponse } from "../rooms/rooms.types";
import type {
  PantryItem,
  PantryItemRaw,
  PantryItemWriteDto,
  PantryListResponseRaw,
} from "./pantry.types";
import { mapPantryItem } from "./pantry.types";

type PantryItemResponseRaw = ApiResponse<{
  pantry_item?: PantryItemRaw;
}>;

export async function apiGetPantry(params: {
  homeId: number;
  token?: string;
  signal?: AbortSignal;
}): Promise<PantryItem[]> {
  const { homeId, token, signal } = params;

  const res = await fetchJson<PantryListResponseRaw>(`/pantry/${homeId}`, {
    method: "GET",
    token,
    signal,
  });

  if (!res.success) throw new Error(res.message || "Pantry failed to load.");

  const raw = Array.isArray(res.data?.pantry_items)
    ? res.data.pantry_items
    : [];
  return raw.map(mapPantryItem);
}

export async function apiCreatePantryItem(params: {
  homeId: number;
  body: PantryItemWriteDto;
  token?: string;
  signal?: AbortSignal;
}): Promise<PantryItem | null> {
  const { homeId, body, token, signal } = params;

  const res = await fetchJson<PantryItemResponseRaw>(`/pantry/${homeId}`, {
    method: "POST",
    token,
    signal,
    body,
  });

  if (!res.success)
    throw new Error(res.message || "Failed to create pantry item.");

  const created = res.data?.pantry_item;
  return created ? mapPantryItem(created) : null;
}

export async function apiUpdatePantryItem(params: {
  homeId: number;
  pantryItemId: number;
  body: PantryItemWriteDto;
  token?: string;
  signal?: AbortSignal;
}): Promise<PantryItem | null> {
  const { homeId, pantryItemId, body, token, signal } = params;

  const res = await fetchJson<PantryItemResponseRaw>(
    `/pantry/${homeId}/${pantryItemId}`,
    {
      method: "POST",
      token,
      signal,
      body,
    }
  );

  if (!res.success)
    throw new Error(res.message || "Failed to update pantry item.");

  const updated = res.data?.pantry_item;
  return updated ? mapPantryItem(updated) : null;
}

export async function apiDeletePantryItem(params: {
  homeId: number;
  pantryItemId: number;
  token?: string;
  signal?: AbortSignal;
}): Promise<void> {
  const { homeId, pantryItemId, token, signal } = params;

  const res = await fetchJson<ApiResponse<unknown>>(
    `/pantry/${homeId}/${pantryItemId}`,
    { method: "GET", token, signal }
  );

  if (!res.success)
    throw new Error(res.message || "Failed to delete pantry item.");
}
