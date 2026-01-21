import RecipeDetailScreen from "@/components/RecipeDetail/RecipeDetailScreen";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useRecipesRag } from "@/features/recipes/useRecipesRag";
import { useSavedRecipesQuery } from "@/hooks/savedRecipes/useSavedRecipesQuery";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { Text } from "react-native";

export default function RecipeDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { primaryResults } = useRecipesRag({ mustContain: [], mustNotContain: [] });
  const { session } = useAuth();
  
  const { data: savedRecipes = [] } = useSavedRecipesQuery({
    homeId: session?.homeId ?? 0,
    token: session?.token,
  });

  const recipe = useMemo(() => {
    // 1. Try finding in rag results
    const fromRag = primaryResults.find((rec) => rec.id === id);
    if (fromRag) return fromRag;

    // 2. Try finding in saved recipes
    const fromSaved = savedRecipes.find((rec) => String(rec.id) === id);
    if (fromSaved) {
      // Map SavedRecipe to RagRecipeResult shape
      return {
        id: String(fromSaved.id),
        recipe_name: fromSaved.recipe_name,
        cuisine_primary: fromSaved.cuisine_primary || undefined,
        description: fromSaved.description || "",
        ingredients: fromSaved.ingredients,
        directions: fromSaved.directions,
        cuisines: [],
      };
    }
    return null;
  }, [id, primaryResults, savedRecipes]);

  if (!recipe) {
    return <Text>Recipe not found</Text>;
  }

  return <RecipeDetailScreen recipe={recipe} />;
}
