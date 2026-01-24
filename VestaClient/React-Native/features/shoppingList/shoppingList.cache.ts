import { shoppingListKey } from "@/React-Native/hooks/shoppingList/useShoppingListQuery";
import { queryClient } from "../../lib/reactQuery";
import type { ShoppingListItem } from "./shoppingList.types";

export function getShoppingListItemFromCache(
  homeId: number,
  shoppingListItemId: number
) {
  const list =
    queryClient.getQueryData<ShoppingListItem[]>(shoppingListKey(homeId)) ?? [];
  return list.find((x) => x.id === shoppingListItemId);
}
