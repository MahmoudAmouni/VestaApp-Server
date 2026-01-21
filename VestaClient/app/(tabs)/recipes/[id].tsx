import RecipeDetailScreen from "@/components/RecipeDetail/RecipeDetailScreen";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useRecipesRag } from "@/features/recipes/useRecipesRag";
import { usePantryQuery } from "@/hooks/pantry/usePantryQuery";
import { useSavedRecipesQuery } from "@/hooks/savedRecipes/useSavedRecipesQuery";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { RagRecipeResult } from "@/features/recipes/recipes.rag.types";

export default function RecipeDetailRoute() {
  const { id, recipeData } = useLocalSearchParams<{ id: string; recipeData?: string }>();
  const { session } = useAuth();
  const homeId = session?.homeId ?? 0;
  const token = session?.token;

  console.log("[RecipeDetail] Looking for recipe ID:", id);
  console.log("[RecipeDetail] Recipe data in params:", !!recipeData);

  const recipeFromParams = useMemo(() => {
    if (recipeData) {
      try {
        const parsed = JSON.parse(recipeData) as RagRecipeResult;
        console.log("[RecipeDetail] Using recipe from navigation params");
        return parsed;
      } catch (err) {
        console.error("[RecipeDetail] Failed to parse recipe data:", err);
        return null;
      }
    }
    return null;
  }, [recipeData]);

  const { data: pantryItems = [] } = usePantryQuery({ homeId, token });
  
  const pantryItemNames = useMemo(
    () => pantryItems.map((item) => item.item_name.name),
    [pantryItems]
  );

  // Only fetch recipes if we don't have recipe data from params
  const { primaryResults, secondaryResults, isLoading: recipesLoading } = useRecipesRag({
    token,
    pantryItems: pantryItemNames,
    mustNotContain: [],
  });
  
  const { data: savedRecipes = [], isLoading: savedLoading } = useSavedRecipesQuery({
    homeId,
    token,
  });

  const recipe = useMemo(() => {
    // If we have recipe from params, use it
    if (recipeFromParams) {
      return recipeFromParams;
    }

    // Otherwise, search for it
    console.log("[RecipeDetail] Primary results count:", primaryResults.length);
    console.log("[RecipeDetail] Secondary results count:", secondaryResults.length);
    console.log("[RecipeDetail] Saved recipes count:", savedRecipes.length);

    const fromPrimary = primaryResults.find((rec) => rec.id === id);
    if (fromPrimary) {
      console.log("[RecipeDetail] Found in primary results");
      return fromPrimary;
    }

    const fromSecondary = secondaryResults.find((rec) => rec.id === id);
    if (fromSecondary) {
      console.log("[RecipeDetail] Found in secondary results");
      return fromSecondary;
    }

    const fromSaved = savedRecipes.find((rec) => String(rec.id) === id);
    if (fromSaved) {
      console.log("[RecipeDetail] Found in saved recipes");
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
    
    console.log("[RecipeDetail] Recipe NOT FOUND in any source");
    return null;
  }, [id, recipeFromParams, primaryResults, secondaryResults, savedRecipes]);

  // Only show loading if we don't have recipe from params
  if (!recipeFromParams && (recipesLoading || savedLoading)) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading recipe...</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ fontSize: 18, marginBottom: 10 }}>Recipe not found</Text>
        <Text style={{ color: "#666" }}>Recipe ID: {id}</Text>
      </View>
    );
  }

  return <RecipeDetailScreen recipe={recipe} />;
}
