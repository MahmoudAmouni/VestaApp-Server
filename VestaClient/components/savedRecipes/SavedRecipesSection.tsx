import React from "react";
import { Text, View } from "react-native";
import { Theme } from "@/type";

import { savedRecipesSectionStyles as styles } from "./SavedRecipesSection.styles";
import RecipeCard from "../Recipe/RecipeCard";

export type SavedRecipe = {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  tags: string[];
};

export default function SavedRecipesSection(props: {
  theme: Theme;
  recipes: SavedRecipe[];
  onPressCook: (id: string) => void;
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
            theme={theme}
            recipe={r}
            saved={true}
            onToggleSave={() => props.onToggleSave(r.id)}
            onPressCook={() => props.onPressCook(r.id)}
          />
        ))}
      </View>
    </View>
  );
}
