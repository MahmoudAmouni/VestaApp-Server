import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../lib/reactQuery";
import type { ShoppingListItem, ShoppingListItemWriteDto } from "../../../features/shoppingList/shoppingList.types";
import { apiCreateShoppingListItem } from "../../../features/shoppingList/shoppingList.api";
import { shoppingListKey } from "../useShoppingListQuery";

import Toast from "react-native-toast-message";

export function useCreateShoppingListItem(args: { homeId: number | undefined; token?: string }) {
  const { homeId, token } = args;

  return useMutation<
    ShoppingListItem | null,
    Error,
    { dto: ShoppingListItemWriteDto },
    { prev?: ShoppingListItem[]; tempId: number }
  >({
    mutationFn: async ({ dto }) => {
      if (!homeId) throw new Error("Home ID is required");
      return apiCreateShoppingListItem({ homeId, body: dto, token });
    },

    onMutate: async ({ dto }) => {
      if (!homeId) return { tempId: 0 };
      await queryClient.cancelQueries({ queryKey: shoppingListKey(homeId) });
      const prev = queryClient.getQueryData<ShoppingListItem[]>(
        shoppingListKey(homeId)
      );

      const tempId = Date.now() * -1;

      const optimistic: ShoppingListItem = {
        id: tempId,
        item_name: { name: dto.item_name },
        unit: { name: dto.unit },
        quantity: dto.quantity,
        is_checked: Boolean(dto.is_checked ?? false),
      };

      queryClient.setQueryData<ShoppingListItem[]>(
        shoppingListKey(homeId),
        (current) => {
          const list = current ?? [];
          return [optimistic, ...list];
        }
      );

      return { prev, tempId };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev)
        queryClient.setQueryData(shoppingListKey(homeId), ctx.prev);
    },

    onSuccess: (created, _vars, ctx) => {
      if (!created) return;

      Toast.show({
        type: "success",
        text1: "Item Added",
        text2: `${created.quantity} ${created.unit.name} ${created.item_name.name} added to shopping list.`,
      });

      queryClient.setQueryData<ShoppingListItem[]>(
        shoppingListKey(homeId),
        (current) => {
          if (!current) return current;
          return current.map((x) => (x.id === ctx?.tempId ? created : x));
        }
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: shoppingListKey(homeId) });
    },
  });
}
