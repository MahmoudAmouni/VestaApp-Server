import { useCreateShoppingListItem } from "./mutations/useCreateShoppingListItem";
import { useUpdateShoppingListItem } from "./mutations/useUpdateShoppingListItem";
import { useDeleteShoppingListItem } from "./mutations/useDeleteShoppingListItem";

export function useShoppingListMutations(args: {
  homeId: number;
  token?: string;
}) {
  const createMutation = useCreateShoppingListItem(args);
  const updateMutation = useUpdateShoppingListItem(args);
  const deleteMutation = useDeleteShoppingListItem(args);

  return { createMutation, updateMutation, deleteMutation };
}
