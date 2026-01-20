import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../lib/reactQuery";
import type { SavedRecipe } from "../../../features/savedRecipes/savedRecipes.types";
import { apiDeleteSavedRecipeByName } from "../../../features/savedRecipes/savedRecipes.api";
import { savedRecipesKey } from "../useSavedRecipesQuery";

export function useDeleteSavedRecipe(args: { homeId: number; token?: string }) {
  const { homeId, token } = args;

  return useMutation<
    void,
    Error,
    { recipeName: string },
    { prev?: SavedRecipe[] }
  >({
    mutationFn: async ({ recipeName }) =>
      apiDeleteSavedRecipeByName({ homeId, recipeName, token }),

    onMutate: async ({ recipeName }) => {
      await queryClient.cancelQueries({ queryKey: savedRecipesKey(homeId) });
      const prev = queryClient.getQueryData<SavedRecipe[]>(
        savedRecipesKey(homeId)
      );

      const target = recipeName.trim();

      queryClient.setQueryData<SavedRecipe[]>(
        savedRecipesKey(homeId),
        (current) => {
          if (!current) return current;
          return current.filter((x) => x.recipe_name !== target);
        }
      );

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev)
        queryClient.setQueryData(savedRecipesKey(homeId), ctx.prev);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: savedRecipesKey(homeId) });
    },
  });
}
