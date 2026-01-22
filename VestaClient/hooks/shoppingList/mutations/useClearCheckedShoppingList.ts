import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../lib/reactQuery";
import type { ShoppingListItem } from "../../../features/shoppingList/shoppingList.types";
import { apiClearCheckedShoppingList } from "../../../features/shoppingList/shoppingList.api";
import { shoppingListKey } from "../useShoppingListQuery";

import Toast from "react-native-toast-message";

export function useClearCheckedShoppingList(args: { homeId: number; token?: string }) {
  const { homeId, token } = args;

  return useMutation<
    void,
    Error,
    void,
    { prev?: ShoppingListItem[] }
  >({
    mutationFn: async () =>
      apiClearCheckedShoppingList({ homeId, token }),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: shoppingListKey(homeId) });
      const prev = queryClient.getQueryData<ShoppingListItem[]>(
        shoppingListKey(homeId)
      );

      queryClient.setQueryData<ShoppingListItem[]>(
        shoppingListKey(homeId),
        (current) => {
          if (!current) return current;
          return current.filter((x) => !x.checked);
        }
      );

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev)
        queryClient.setQueryData(shoppingListKey(homeId), ctx.prev);
    },

    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Cleared",
        text2: "Checked items removed from shopping list.",
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: shoppingListKey(homeId) });
    },
  });
}
