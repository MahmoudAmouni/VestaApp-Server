import type { ApiResponse } from "../rooms/rooms.types";

export type PantryNamedEntity = {
  name: string;
};

export type PantryItem = {
  id: number;

  item_name: PantryNamedEntity; 
  location?: PantryNamedEntity; 
  unit?: PantryNamedEntity; 

  quantity: number;
  expiry_date: string | null;
};

export type PantryListResponseRaw = ApiResponse<{
  pantry_items: PantryItemRaw[];
}>;

export type PantryItemWriteDto = {
  item_name: string;
  location: string | null;
  unit: string | null;
  quantity: number;
  expiry_date: string | null;
};

export type PantryItemPatch = Partial<PantryItemWriteDto>;


export type PantryNamedEntityRaw = {
  id: number;
  name: string;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
};

export type PantryItemRaw = {
  id: number;

  home_id?: number;
  owner_user_id?: number | null;
  item_name_id?: number;
  location_id?: number;
  unit_id?: number;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;

  quantity: number;
  expiry_date: string | null;

  item_name?: PantryNamedEntityRaw;
  location?: PantryNamedEntityRaw;
  unit?: PantryNamedEntityRaw;
};

export function mapPantryItem(raw: PantryItemRaw): PantryItem {
  if (!raw.item_name?.name) {
    throw new Error("Pantry item is missing item_name.name from API response.");
  }

  return {
    id: raw.id,
    item_name: { name: raw.item_name.name },
    location: raw.location?.name ? { name: raw.location.name } : undefined,
    unit: raw.unit?.name ? { name: raw.unit.name } : undefined,
    quantity: raw.quantity,
    expiry_date: raw.expiry_date ?? null,
  };
}
