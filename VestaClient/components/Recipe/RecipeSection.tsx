import React from "react";
import { Text, View } from "react-native";
import { theme } from "@/constants/theme";
import RecipeCard from "./RecipeCard";
import { recipesSectionStyles as styles } from "./RecipesSection.styles";
import { RagRecipeResult } from "@/features/recipes/recipes.rag.types";

export default function RecipesSection(props: {
  recipes: RagRecipeResult[];
  isSaved: (id: string) => boolean;
  onToggleSave: (id: string) => void;
  onPressCook: (id: string) => void;
}) {
  const { recipes } = props;
  

  return (
    <View style={styles.wrap}>
      <Text style={[styles.title, { color: theme.text }]}>Recipes</Text>

      <View style={styles.list}>
        {props.recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            theme={theme}
            recipe={recipe}
            saved={props.isSaved(recipe.id)}
            onToggleSave={() => props.onToggleSave(recipe.id)}
            onPressCook={() => props.onPressCook(recipe.id)}
          />
        ))}
      </View>
    </View>
  );
}
