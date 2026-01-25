import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../lib/reactQuery";
import type { PantryItem, PantryItemWriteDto } from "../../../features/pantry/pantry.types";
import { apiCreatePantryItem } from "../../../features/pantry/pantry.api";
import { pantryKey } from "../usePantryQuery";

import Toast from "react-native-toast-message";

export function useCreatePantryItem(args: { homeId: number | undefined; token?: string }) {
  const { homeId, token } = args;

  return useMutation<
    PantryItem | null,
    Error,
    { dto: PantryItemWriteDto },
    { prev?: PantryItem[]; tempId: number }
  >({
    mutationFn: async ({ dto }) => {
      if (!homeId) throw new Error("No home ID");
      return apiCreatePantryItem({ homeId, body: dto, token });
    },

    onMutate: async ({ dto }) => {
      if (!homeId) return { tempId: 0 };
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
      if (homeId && ctx?.prev) queryClient.setQueryData(pantryKey(homeId), ctx.prev);
    },

    onSuccess: (created, _vars, ctx) => {
      if (!created || !homeId) return;

      Toast.show({
        type: "success",
        text1: "Item Added",
        text2: `${created.item_name.name} has been added to your pantry.`,
      });

      queryClient.setQueryData<PantryItem[]>(pantryKey(homeId), (current) => {
        if (!current) return current;
        return current.map((x) => (x.id === ctx?.tempId ? created : x));
      });
    },

    onSettled: () => {
      if (homeId) queryClient.invalidateQueries({ queryKey: pantryKey(homeId) });
    },
  });
}
