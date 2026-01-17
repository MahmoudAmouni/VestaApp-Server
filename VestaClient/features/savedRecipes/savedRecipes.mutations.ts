import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../lib/reactQuery";
import type { SavedRecipe, SavedRecipeWriteDto } from "./savedRecipes.types";
import {
  apiCreateSavedRecipe,
  apiDeleteSavedRecipeByName,
} from "./savedRecipes.api";
import { savedRecipesKey } from "./savedRecipes.query";

export function useSavedRecipesMutations(args: {
  homeId: number;
  token?: string;
}) {
  const { homeId, token } = args;

  const createMutation = useMutation<
    SavedRecipe | null,
    Error,
    { dto: SavedRecipeWriteDto },
    { prev?: SavedRecipe[]; tempId: number }
  >({
    mutationFn: async ({ dto }) =>
      apiCreateSavedRecipe({ homeId, body: dto, token }),

    onMutate: async ({ dto }) => {
      await queryClient.cancelQueries({ queryKey: savedRecipesKey(homeId) });
      const prev = queryClient.getQueryData<SavedRecipe[]>(
        savedRecipesKey(homeId)
      );

      const tempId = Date.now() * -1;

      const optimistic: SavedRecipe = {
        id: tempId,
        recipe_name: dto.recipe_name,
        ingredients: dto.ingredients ?? "",
        directions: dto.directions ?? "",
        cuisine_primary: dto.cuisine_primary ?? null,
        description: dto.description ?? null,
        created_at: null,
        updated_at: null,
      };

      queryClient.setQueryData<SavedRecipe[]>(
        savedRecipesKey(homeId),
        (current) => {
          const list = current ?? [];
          return [optimistic, ...list];
        }
      );

      return { prev, tempId };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev)
        queryClient.setQueryData(savedRecipesKey(homeId), ctx.prev);
    },

    onSuccess: (created, _vars, ctx) => {
      if (!created) return;

      queryClient.setQueryData<SavedRecipe[]>(
        savedRecipesKey(homeId),
        (current) => {
          if (!current) return current;
          return current.map((x) => (x.id === ctx?.tempId ? created : x));
        }
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: savedRecipesKey(homeId) });
    },
  });

  const deleteByNameMutation = useMutation<
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

  return { createMutation, deleteByNameMutation };
}
