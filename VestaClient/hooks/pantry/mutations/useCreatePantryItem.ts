import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../lib/reactQuery";
import type { PantryItem, PantryItemWriteDto } from "../../../features/pantry/pantry.types";
import { apiCreatePantryItem } from "../../../features/pantry/pantry.api";
import { pantryKey } from "../usePantryQuery";

export function useCreatePantryItem(args: { homeId: number; token?: string }) {
  const { homeId, token } = args;

  return useMutation<
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
}
