import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../lib/reactQuery";
import type { ShoppingListItem } from "../../../features/shoppingList/shoppingList.types";
import { apiDeleteShoppingListItem } from "../../../features/shoppingList/shoppingList.api";
import { shoppingListKey } from "../useShoppingListQuery";

export function useDeleteShoppingListItem(args: { homeId: number; token?: string }) {
  const { homeId, token } = args;

  return useMutation<
    void,
    Error,
    { shoppingListItemId: number },
    { prev?: ShoppingListItem[] }
  >({
    mutationFn: async ({ shoppingListItemId }) =>
      apiDeleteShoppingListItem({ homeId, shoppingListItemId, token }),

    onMutate: async ({ shoppingListItemId }) => {
      await queryClient.cancelQueries({ queryKey: shoppingListKey(homeId) });
      const prev = queryClient.getQueryData<ShoppingListItem[]>(
        shoppingListKey(homeId)
      );

      queryClient.setQueryData<ShoppingListItem[]>(
        shoppingListKey(homeId),
        (current) => {
          if (!current) return current;
          return current.filter((x) => x.id !== shoppingListItemId);
        }
      );

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev)
        queryClient.setQueryData(shoppingListKey(homeId), ctx.prev);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: shoppingListKey(homeId) });
    },
  });
}
