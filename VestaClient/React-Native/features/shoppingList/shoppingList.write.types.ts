import type {
  ShoppingListItem,
  ShoppingListItemPatch,
  ShoppingListItemWriteDto,
} from "./shoppingList.types";

export function buildShoppingListItemWriteDto(
  item: ShoppingListItem,
  patch: ShoppingListItemPatch = {}
): ShoppingListItemWriteDto {
  const currentItemName = item.item_name?.name;
  const currentUnitName = item.unit?.name;

  if (!currentItemName) {
    throw new Error("Cannot build DTO: item_name.name missing in cached item.");
  }
  if (!currentUnitName) {
    throw new Error("Cannot build DTO: unit.name missing in cached item.");
  }

  return {
    item_name: patch.item_name ?? currentItemName,
    unit: patch.unit ?? currentUnitName,
    quantity: patch.quantity ?? item.quantity,
    is_checked:
      patch.is_checked !== undefined ? patch.is_checked : item.is_checked,
  };
}
