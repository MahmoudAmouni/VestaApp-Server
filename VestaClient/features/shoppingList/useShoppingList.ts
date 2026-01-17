import { useShoppingListQuery } from "./shoppingList.query";
import { useShoppingListMutations } from "./shoppingList.mutations";
import type {
  ShoppingListItemPatch,
  ShoppingListItemWriteDto,
} from "./shoppingList.types";

export function useShoppingList(homeId: number, token?: string) {
  const listQuery = useShoppingListQuery({ homeId, token });
  const { createMutation, updateMutation, deleteMutation } =
    useShoppingListMutations({
      homeId,
      token,
    });

  return {
    shoppingListItems: listQuery.data ?? [],
    isLoading: listQuery.isLoading,
    isFetching: listQuery.isFetching,
    error: listQuery.error ?? null,

    createShoppingListItem: (dto: ShoppingListItemWriteDto) =>
      createMutation.mutate({ dto }),

    updateShoppingListItem: (
      shoppingListItemId: number,
      patch: ShoppingListItemPatch
    ) => updateMutation.mutate({ shoppingListItemId, patch }),

    deleteShoppingListItem: (shoppingListItemId: number) =>
      deleteMutation.mutate({ shoppingListItemId }),
  };
}
