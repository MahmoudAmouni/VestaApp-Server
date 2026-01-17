import { useQuery } from "@tanstack/react-query";
import type { ShoppingListItem } from "./shoppingList.types";
import { apiGetShoppingList } from "./shoppingList.api";

export const shoppingListKey = (homeId: number) =>
  ["shoppinglist", "home", homeId] as const;

export function useShoppingListQuery(args: { homeId: number; token?: string }) {
  const { homeId, token } = args;

  return useQuery<ShoppingListItem[], Error>({
    queryKey: shoppingListKey(homeId),
    queryFn: ({ signal }) => apiGetShoppingList({ homeId, token, signal }),
    staleTime: 30_000,
  });
}
