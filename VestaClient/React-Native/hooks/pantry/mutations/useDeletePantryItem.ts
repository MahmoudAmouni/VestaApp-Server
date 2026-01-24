import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../lib/reactQuery";
import type { PantryItem } from "../../../features/pantry/pantry.types";
import { apiDeletePantryItem } from "../../../features/pantry/pantry.api";
import { pantryKey } from "../usePantryQuery";

import Toast from "react-native-toast-message";

export function useDeletePantryItem(args: { homeId: number | undefined; token?: string }) {
  const { homeId, token } = args;

  return useMutation<
    void,
    Error,
    { pantryItemId: number },
    { prev?: PantryItem[] }
  >({
    mutationFn: async ({ pantryItemId }) => {
      if (!homeId) throw new Error("No home ID");
      return apiDeletePantryItem({ homeId, pantryItemId, token });
    },

    onMutate: async ({ pantryItemId }) => {
      if (!homeId) return {};
      await queryClient.cancelQueries({ queryKey: pantryKey(homeId) });
      const prev = queryClient.getQueryData<PantryItem[]>(pantryKey(homeId));

      queryClient.setQueryData<PantryItem[]>(pantryKey(homeId), (current) => {
        if (!current) return current;
        return current.filter((x) => x.id !== pantryItemId);
      });

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (homeId && ctx?.prev) queryClient.setQueryData(pantryKey(homeId), ctx.prev);
    },

    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Item Deleted",
        text2: "The item has been removed from your pantry.",
      });
    },

    onSettled: () => {
      if (homeId) queryClient.invalidateQueries({ queryKey: pantryKey(homeId) });
    },
  });
}
