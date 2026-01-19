import { useCreatePantryItem } from "./mutations/useCreatePantryItem";
import { useUpdatePantryItem } from "./mutations/useUpdatePantryItem";
import { useDeletePantryItem } from "./mutations/useDeletePantryItem";

export function usePantryMutations(args: { homeId: number; token?: string }) {
  const createMutation = useCreatePantryItem(args);
  const updateMutation = useUpdatePantryItem(args);
  const deleteMutation = useDeletePantryItem(args);

  return { createMutation, updateMutation, deleteMutation };
}

