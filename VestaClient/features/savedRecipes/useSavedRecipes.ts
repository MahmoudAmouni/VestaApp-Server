import { useSavedRecipesQuery } from "./savedRecipes.query";
import { useSavedRecipesMutations } from "./savedRecipes.mutations";

export function useSavedRecipes(homeId: number, token?: string) {
  const savedRecipesQuery = useSavedRecipesQuery({ homeId, token });
  const { createMutation, deleteByNameMutation } = useSavedRecipesMutations({
    homeId,
    token,
  });

  return {
    savedRecipes: savedRecipesQuery.data ?? [],
    isLoading: savedRecipesQuery.isLoading,
    isFetching: savedRecipesQuery.isFetching,
    error: savedRecipesQuery.error ?? null,

    saveRecipe: createMutation.mutate,
    deleteRecipeByName: deleteByNameMutation.mutate,
  };
}
