import { useQuery } from "@tanstack/react-query";
import type { SavedRecipe } from "./savedRecipes.types";
import { apiGetSavedRecipes } from "./savedRecipes.api";

export const savedRecipesKey = (homeId: number) =>
  ["savedrecipes", "home", homeId] as const;

export function useSavedRecipesQuery(args: { homeId: number; token?: string }) {
  const { homeId, token } = args;

  return useQuery<SavedRecipe[], Error>({
    queryKey: savedRecipesKey(homeId),
    queryFn: ({ signal }) => apiGetSavedRecipes({ homeId, token, signal }),
    staleTime: 30_000,
  });
}
