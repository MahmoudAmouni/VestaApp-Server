import { useCreateShoppingListItem } from "./mutations/useCreateShoppingListItem";
import { useUpdateShoppingListItem } from "./mutations/useUpdateShoppingListItem";
import { useClearCheckedShoppingList } from "./mutations/useClearCheckedShoppingList";

export function useShoppingListMutations(args: {
  homeId: number;
  token?: string;
}) {
  const createMutation = useCreateShoppingListItem(args);
  const updateMutation = useUpdateShoppingListItem(args);
  const clearCheckedMutation = useClearCheckedShoppingList(args);

  return { createMutation, updateMutation, clearCheckedMutation };
}
