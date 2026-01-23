import { useQuery } from "@tanstack/react-query";
import type { ShoppingListItem } from "../../features/shoppingList/shoppingList.types";
import { apiGetShoppingList } from "../../features/shoppingList/shoppingList.api";

export const shoppingListKey = (homeId: number | undefined) =>
  ["shoppinglist", "home", homeId] as const;

export function useShoppingListQuery(args: { homeId: number | undefined; token?: string }) {
  const { homeId, token } = args;

  return useQuery<ShoppingListItem[], Error>({
    queryKey: shoppingListKey(homeId),
    queryFn: ({ signal }) => {
        if (!homeId) throw new Error("Home ID is required");
        return apiGetShoppingList({ homeId, token, signal })
    },
    staleTime: 30_000,
    enabled: !!homeId,
  });
}
