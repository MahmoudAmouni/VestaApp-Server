import React from "react";
import { Text, View } from "react-native";
import { Theme } from "@/type";

import { savedRecipesSectionStyles as styles } from "./SavedRecipesSection.styles";
import RecipeCard from "../Recipe/RecipeCard/RecipeCard";
import { SavedRecipe } from "@/React-Native/features/savedRecipes/savedRecipes.types";

export type { SavedRecipe };

export default function SavedRecipesSection(props: {
  theme: Theme;
  recipes: SavedRecipe[];
  onPressCook: (id: number) => void;
  onToggleSave: (id: string) => void;
}) {
  const { theme } = props;

  return (
    <View style={styles.wrap}>
      <Text style={[styles.title, { color: theme.text }]}>Saved Recipes</Text>

      <View style={styles.list}>
        {props.recipes.map((r) => (
          <RecipeCard
            key={r.id}
            
            recipe={{
              id: String(r.id),
              recipe_name: r.recipe_name,
              ingredients: r.ingredients,
              directions: r.directions,
              description: r.description || "",
              cuisine_primary: r.cuisine_primary || undefined,
            }}
            saved={true}
            onToggleSave={() => props.onToggleSave(String(r.id))}
            onPressCook={() => props.onPressCook(r.id)}
          />
        ))}
      </View>
    </View>
  );
}
