import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../lib/reactQuery";
import type { PantryItem } from "../pantry.types";
import { apiDeletePantryItem } from "../pantry.api";
import { pantryKey } from "../pantry.query";

export function useDeletePantryItem(args: { homeId: number; token?: string }) {
  const { homeId, token } = args;

  return useMutation<
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
}
