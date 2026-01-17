import type {
  PantryItem,
  PantryItemPatch,
  PantryItemWriteDto,
} from "./pantry.types";

export function buildPantryItemWriteDto(
  item: PantryItem,
  patch: PantryItemPatch = {}
): PantryItemWriteDto {
  const currentItemName = item.item_name?.name;
  if (!currentItemName) {
    throw new Error("Cannot build DTO: item_name.name missing in cached item.");
  }

  return {
    item_name: patch.item_name ?? currentItemName,
    location:
      patch.location !== undefined
        ? patch.location
        : item.location?.name ?? null,
    unit: patch.unit !== undefined ? patch.unit : item.unit?.name ?? null,
    quantity: patch.quantity ?? item.quantity,
    expiry_date:
      patch.expiry_date !== undefined ? patch.expiry_date : item.expiry_date,
  };
}
