import { queryClient } from "../../lib/reactQuery";
import type { ShoppingListItem } from "./shoppingList.types";
import { shoppingListKey } from "./shoppingList.query";

export function getShoppingListItemFromCache(
  homeId: number,
  shoppingListItemId: number
) {
  const list =
    queryClient.getQueryData<ShoppingListItem[]>(shoppingListKey(homeId)) ?? [];
  return list.find((x) => x.id === shoppingListItemId);
}
