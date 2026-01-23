import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../lib/reactQuery";
import type { ShoppingListItem, ShoppingListItemPatch } from "../../../features/shoppingList/shoppingList.types";
import { buildShoppingListItemWriteDto } from "../../../features/shoppingList/shoppingList.write.types";
import { apiUpdateShoppingListItem } from "../../../features/shoppingList/shoppingList.api";
import { shoppingListKey } from "../useShoppingListQuery";
import { getShoppingListItemFromCache } from "../../../features/shoppingList/shoppingList.cache";

import Toast from "react-native-toast-message";

export function useUpdateShoppingListItem(args: { homeId: number | undefined; token?: string }) {
  const { homeId, token } = args;

  return useMutation<
    ShoppingListItem | null,
    Error,
    { shoppingListItemId: number; patch: ShoppingListItemPatch },
    { prev?: ShoppingListItem[]; nextOptimistic?: ShoppingListItem }
  >({
    mutationFn: async ({ shoppingListItemId, patch }) => {
      if (!homeId) throw new Error("Home ID is required");
      const current = getShoppingListItemFromCache(homeId, shoppingListItemId);
      if (!current) {
        throw new Error("Shopping list item not found in cache. Try refetch.");
      }

      const dto = buildShoppingListItemWriteDto(current, patch);
      return apiUpdateShoppingListItem({
        homeId,
        shoppingListItemId,
        body: dto,
        token,
      });
    },

    onMutate: async ({ shoppingListItemId, patch }) => {
      if (!homeId) return {};
      await queryClient.cancelQueries({ queryKey: shoppingListKey(homeId) });
      const prev = queryClient.getQueryData<ShoppingListItem[]>(
        shoppingListKey(homeId)
      );

      let nextOptimistic: ShoppingListItem | undefined;

      queryClient.setQueryData<ShoppingListItem[]>(
        shoppingListKey(homeId),
        (current) => {
          if (!current) return current;

          return current.map((x) => {
            if (x.id !== shoppingListItemId) return x;

            nextOptimistic = {
              ...x,
              item_name: { name: patch.item_name ?? x.item_name.name },
              unit: { name: patch.unit ?? x.unit.name },
              quantity: patch.quantity ?? x.quantity,
              is_checked:
                patch.is_checked !== undefined
                  ? Boolean(patch.is_checked)
                  : x.is_checked,
            };

            return nextOptimistic;
          });
        }
      );

      return { prev, nextOptimistic };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev)
        queryClient.setQueryData(shoppingListKey(homeId), ctx.prev);
    },

    onSuccess: (updated, vars) => {
      if (!updated) return;

      if (vars.patch.item_name || vars.patch.quantity || vars.patch.unit) {
        Toast.show({
          type: "success",
          text1: "Item Updated",
          text2: `${updated.quantity} ${updated.unit.name} ${updated.item_name.name} has been updated.`,
        });
      }

      queryClient.setQueryData<ShoppingListItem[]>(
        shoppingListKey(homeId),
        (current) => {
          if (!current) return current;
          return current.map((x) =>
            x.id === vars.shoppingListItemId ? updated : x
          );
        }
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: shoppingListKey(homeId) });
    },
  });
}
