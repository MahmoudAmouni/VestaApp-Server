import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../lib/reactQuery";
import type { PantryItem, PantryItemPatch } from "../pantry.types";
import { buildPantryItemWriteDto } from "../pantry.write.types";
import { apiUpdatePantryItem } from "../pantry.api";
import { pantryKey } from "../pantry.query";
import { getPantryItemFromCache } from "../pantry.cache";

export function useUpdatePantryItem(args: { homeId: number; token?: string }) {
  const { homeId, token } = args;

  return useMutation<
    PantryItem | null,
    Error,
    { pantryItemId: number; patch: PantryItemPatch },
    { prev?: PantryItem[]; nextOptimistic?: PantryItem }
  >({
    mutationFn: async ({ pantryItemId, patch }) => {
      const current = getPantryItemFromCache(homeId, pantryItemId);
      if (!current)
        throw new Error("Pantry item not found in cache. Try refetch.");

      const dto = buildPantryItemWriteDto(current, patch);
      return apiUpdatePantryItem({ homeId, pantryItemId, body: dto, token });
    },

    onMutate: async ({ pantryItemId, patch }) => {
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
      if (ctx?.prev) queryClient.setQueryData(pantryKey(homeId), ctx.prev);
    },

    onSuccess: (updated, vars) => {
      if (!updated) return;

      queryClient.setQueryData<PantryItem[]>(pantryKey(homeId), (current) => {
        if (!current) return current;
        return current.map((x) => (x.id === vars.pantryItemId ? updated : x));
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: pantryKey(homeId) });
    },
  });
}
