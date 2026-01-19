import { useCreateSavedRecipe } from "./mutations/useCreateSavedRecipe";
import { useDeleteSavedRecipe } from "./mutations/useDeleteSavedRecipe";

export function useSavedRecipesMutations(args: {
  homeId: number;
  token?: string;
}) {
  const createMutation = useCreateSavedRecipe(args);
  const deleteByNameMutation = useDeleteSavedRecipe(args);

  return { createMutation, deleteByNameMutation };
}
