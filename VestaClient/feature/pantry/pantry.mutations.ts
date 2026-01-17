import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../lib/reactQuery";
import type {
  PantryItem,
  PantryItemPatch,
  PantryItemWriteDto,
} from "./pantry.types";
import { buildPantryItemWriteDto } from "./pantry.write.types";
import {
  apiCreatePantryItem,
  apiDeletePantryItem,
  apiUpdatePantryItem,
} from "./pantry.api";
import { pantryKey } from "./pantry.query";
import { getPantryItemFromCache } from "./pantry.cache";

export function usePantryMutations(args: { homeId: number; token?: string }) {
  const { homeId, token } = args;

  const createMutation = useMutation<
    PantryItem | null,
    Error,
    { dto: PantryItemWriteDto },
    { prev?: PantryItem[]; tempId: number }
  >({
    mutationFn: async ({ dto }) =>
      apiCreatePantryItem({ homeId, body: dto, token }),

    onMutate: async ({ dto }) => {
      await queryClient.cancelQueries({ queryKey: pantryKey(homeId) });
      const prev = queryClient.getQueryData<PantryItem[]>(pantryKey(homeId));

      const tempId = Date.now() * -1;

      const optimistic: PantryItem = {
        id: tempId,
        item_name: { name: dto.item_name },
        location: dto.location ? { name: dto.location } : undefined,
        unit: dto.unit ? { name: dto.unit } : undefined,
        quantity: dto.quantity,
        expiry_date: dto.expiry_date ?? null,
      };

      queryClient.setQueryData<PantryItem[]>(pantryKey(homeId), (current) => {
        const list = current ?? [];
        return [optimistic, ...list];
      });

      return { prev, tempId };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(pantryKey(homeId), ctx.prev);
    },

    onSuccess: (created, _vars, ctx) => {
      if (!created) return;

      queryClient.setQueryData<PantryItem[]>(pantryKey(homeId), (current) => {
        if (!current) return current;
        return current.map((x) => (x.id === ctx?.tempId ? created : x));
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: pantryKey(homeId) });
    },
  });

  const updateMutation = useMutation<
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

  const deleteMutation = useMutation<
    void,
    Error,
    { pantryItemId: number },
    { prev?: PantryItem[] }
  >({
    mutationFn: async ({ pantryItemId }) =>
      apiDeletePantryItem({ homeId, pantryItemId, token }),

    onMutate: async ({ pantryItemId }) => {
      await queryClient.cancelQueries({ queryKey: pantryKey(homeId) });
      const prev = queryClient.getQueryData<PantryItem[]>(pantryKey(homeId));

      queryClient.setQueryData<PantryItem[]>(pantryKey(homeId), (current) => {
        if (!current) return current;
        return current.filter((x) => x.id !== pantryItemId);
      });

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(pantryKey(homeId), ctx.prev);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: pantryKey(homeId) });
    },
  });

  return { createMutation, updateMutation, deleteMutation };
}
