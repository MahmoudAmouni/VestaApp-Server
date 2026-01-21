import React, { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { router } from "expo-router";

import BottomNav from "@/components/ui/BottomNav";
import { recipeDetailStyles as styles } from "./RecipeDetailScreen.styles";
import RecipeDetailHeader from "@/components/RecipeDetail/RecipeDetailHeader";
import QuickStatsCard, { QuickStat } from "@/components/RecipeDetail/QuickStatsCard";
import DescriptionSection from "@/components/RecipeDetail/DescriptionSection";
import IngredientsSection   from "@/components/RecipeDetail/IngredientSection";
import StepsSection from "@/components/RecipeDetail/StepsSection";
import { useTheme } from "@/contexts/theme/ThemeContext";
import { RagRecipeResult } from "@/features/recipes/recipes.rag.types";


export default function RecipeDetailScreen({recipe}:{recipe:RagRecipeResult}) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const ingredients = recipe.ingredients.split("$$")

  const steps = recipe.directions.split("$$")
  const diff = steps.length > 10 ? "Hard" : steps.length < 5 ? "Easy" : "Meduim"

  const [saved, setSaved] = useState(true);

  const stats: QuickStat[] = useMemo(
    () => [
      { label: "Time", value: recipe.cuisine_primary },
      { label: "Steps", value: steps.length },
      { label: "Ingredients", value: ingredients.length },
      { label: "Difficulty", value: diff },
    ],
    [recipe,ingredients,diff,steps]
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <View style={styles.screen}>
        <RecipeDetailHeader
          theme={theme}
          title={recipe.recipe_name}
          saved={saved}
          onBack={() => router.replace("/(tabs)/recipes")}
          onToggleSave={() => setSaved((v) => !v)}
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: 110 + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <QuickStatsCard
            theme={theme}
            title="Let's cook."
            subtitle="Ingredients, steps, and timers everything in one place."
            stats={stats}
          />

          <DescriptionSection
            theme={theme}
            text={recipe.description}
          />

          <IngredientsSection theme={theme} items={ingredients} />

          <StepsSection theme={theme} steps={steps} />
        </ScrollView>

      </View>
    </SafeAreaView>
  );
}
