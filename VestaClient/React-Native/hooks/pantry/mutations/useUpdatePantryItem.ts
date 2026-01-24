import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../lib/reactQuery";
import type { PantryItem, PantryItemPatch } from "../../../features/pantry/pantry.types";
import { buildPantryItemWriteDto } from "../../../features/pantry/pantry.write.types";
import { apiUpdatePantryItem } from "../../../features/pantry/pantry.api";
import { pantryKey } from "../usePantryQuery";
import { getPantryItemFromCache } from "../../../features/pantry/pantry.cache";

import Toast from "react-native-toast-message";

export function useUpdatePantryItem(args: { homeId: number | undefined; token?: string }) {
  const { homeId, token } = args;

  return useMutation<
    PantryItem | null,
    Error,
    { pantryItemId: number; patch: PantryItemPatch },
    { prev?: PantryItem[]; nextOptimistic?: PantryItem }
  >({
    mutationFn: async ({ pantryItemId, patch }) => {
      if (!homeId) throw new Error("No home ID");
      const current = getPantryItemFromCache(homeId, pantryItemId);
      if (!current)
        throw new Error("Pantry item not found in cache. Try refetch.");

      const dto = buildPantryItemWriteDto(current, patch);
      return apiUpdatePantryItem({ homeId, pantryItemId, body: dto, token });
    },

    onMutate: async ({ pantryItemId, patch }) => {
      if (!homeId) return {};
      await queryClient.cancelQueries({ queryKey: pantryKey(homeId) });
      const prev = queryClient.getQueryData<PantryItem[]>(pantryKey(homeId));

      let nextOptimistic: PantryItem | undefined;

      queryClient.setQueryData<PantryItem[]>(pantryKey(homeId), (current) => {
        if (!current) return current;

        return current.map((x) => {
          if (x.id !== pantryItemId) return x;

          nextOptimistic = {
            ...x,
            item_name: { name: patch.item_name ?? x.item_name.name },

            location:
              patch.location !== undefined
                ? patch.location
                  ? { name: patch.location }
                  : undefined
                : x.location,

            unit:
              patch.unit !== undefined
                ? patch.unit
                  ? { name: patch.unit }
                  : undefined
                : x.unit,

            quantity: patch.quantity ?? x.quantity,
            expiry_date:
              patch.expiry_date !== undefined
                ? patch.expiry_date
                : x.expiry_date,
          };

          return nextOptimistic;
        });
      });

      return { prev, nextOptimistic };
    },

    onError: (_err, _vars, ctx) => {
      if (homeId && ctx?.prev) queryClient.setQueryData(pantryKey(homeId), ctx.prev);
    },

    onSuccess: (updated, vars) => {
      if (!updated || !homeId) return;

      Toast.show({
        type: "success",
        text1: "Item Updated",
        text2: `${updated.item_name.name} has been updated.`,
      });

      queryClient.setQueryData<PantryItem[]>(pantryKey(homeId), (current) => {
        if (!current) return current;
        return current.map((x) => (x.id === vars.pantryItemId ? updated : x));
      });
    },

    onSettled: () => {
      if (homeId) queryClient.invalidateQueries({ queryKey: pantryKey(homeId) });
    },
  });
}
