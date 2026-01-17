import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../lib/reactQuery";
import type {
  ShoppingListItem,
  ShoppingListItemPatch,
  ShoppingListItemWriteDto,
} from "./shoppingList.types";
import { buildShoppingListItemWriteDto } from "./shoppingList.write.types";
import {
  apiCreateShoppingListItem,
  apiDeleteShoppingListItem,
  apiUpdateShoppingListItem,
} from "./shoppingList.api";
import { shoppingListKey } from "./shoppingList.query";
import { getShoppingListItemFromCache } from "./shoppingList.cache";

export function useShoppingListMutations(args: {
  homeId: number;
  token?: string;
}) {
  const { homeId, token } = args;

  const createMutation = useMutation<
    ShoppingListItem | null,
    Error,
    { dto: ShoppingListItemWriteDto },
    { prev?: ShoppingListItem[]; tempId: number }
  >({
    mutationFn: async ({ dto }) =>
      apiCreateShoppingListItem({ homeId, body: dto, token }),

    onMutate: async ({ dto }) => {
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

  const updateMutation = useMutation<
    ShoppingListItem | null,
    Error,
    { shoppingListItemId: number; patch: ShoppingListItemPatch },
    { prev?: ShoppingListItem[]; nextOptimistic?: ShoppingListItem }
  >({
    mutationFn: async ({ shoppingListItemId, patch }) => {
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

  const deleteMutation = useMutation<
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

  return { createMutation, updateMutation, deleteMutation };
}
