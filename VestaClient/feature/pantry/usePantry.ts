import { usePantryQuery } from "./pantry.query";
import { usePantryMutations } from "./pantry.mutations";

export function usePantry(homeId: number, token?: string) {
  const pantryQuery = usePantryQuery({ homeId, token });
  const { createMutation, updateMutation, deleteMutation } = usePantryMutations(
    {
      homeId,
      token,
    }
  );

  return {
    pantryItems: pantryQuery.data ?? [],
    isLoading: pantryQuery.isLoading,
    isFetching: pantryQuery.isFetching,
    error: pantryQuery.error ?? null,

    createPantryItem: createMutation.mutate,
    updatePantryItem: updateMutation.mutate,
    deletePantryItem: deleteMutation.mutate,
  };
}
