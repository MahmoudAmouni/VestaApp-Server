import { router } from "expo-router";
import React, { useState, useMemo } from "react";
import { Pressable, SafeAreaView, ScrollView, StatusBar, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useSafeAreaInsets,
} from "react-native-safe-area-context";



import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import HeroCard from "@/components/ui/HeroCard";
import Skeleton from "@/components/ui/Skeleton";

import RecipesSection from "./RecipesSection/RecipesSection";
import { recipesScreenStyles as styles } from "./RecipesScreen.styles";
import { useRecipesRag } from "@/features/recipes/useRecipesRag";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useTheme } from "@/contexts/theme/ThemeContext";
import { useSavedRecipesQuery } from "@/hooks/savedRecipes/useSavedRecipesQuery";
import { useCreateSavedRecipe } from "@/hooks/savedRecipes/mutations/useCreateSavedRecipe";
import { useDeleteSavedRecipe } from "@/hooks/savedRecipes/mutations/useDeleteSavedRecipe";
import { usePantryQuery } from "@/hooks/pantry/usePantryQuery";

export default function RecipesScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { session } = useAuth();
  const token = session?.token;
  const homeId = session?.homeId ?? 0;

  const { data: pantryItems = [] } = usePantryQuery({ homeId, token });
  
  const pantryItemNames = useMemo(
    () => pantryItems.map((item) => item.item_name.name),
    [pantryItems]
  );

  const { isLoading, primaryResults, secondaryResults, refetch } = useRecipesRag({
    token,
    pantryItems: pantryItemNames,
    mustNotContain: [],
  });

  const allRecipes = useMemo(
    () => [...primaryResults, ...secondaryResults],
    [primaryResults, secondaryResults]
  );

  const { data: savedRecipes = [] } = useSavedRecipesQuery({ homeId, token });
  const { mutate: saveRecipe } = useCreateSavedRecipe({ homeId, token });
  const { mutate: deleteRecipe } = useDeleteSavedRecipe({ homeId, token });

  function isRecipeSaved(name: string) {
    return savedRecipes.some((r) => r.recipe_name === name);
  }

  function toggleSave(id: string) {
    const recipe = allRecipes.find((r) => r.id === id);
    if (!recipe) return;

    if (isRecipeSaved(recipe.recipe_name)) {
      deleteRecipe({ recipeName: recipe.recipe_name });
    } else {
      saveRecipe({
        dto: {
          recipe_name: recipe.recipe_name,
          ingredients: recipe.ingredients,
          directions: recipe.directions,
          cuisine_primary: recipe.cuisine_primary ?? null,
          description: recipe.description,
        },
      });
    }
  }
  
  
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle="light-content" />
      <View style={styles.screen}>
        <Header
          theme={theme}
          title="Recipes"
          kicker="Taste & Explore"
          icon="restaurant-outline"
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: 150 + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <HeroCard
            theme={theme}
            title="Use what you have."
            loading={isLoading}
            sub="Vesta pulls ideas from your pantry + world recipes."
            kpis={[
              { label: "Saved Recipes", value: savedRecipes.length.toString() },
              { label: "More Recipes ?", value: "Ask Ai" },
            ]}
          >
            <Button
              variant="secondary"
              label="Saved recipes"
              onPress={() => router.push("/recipes/savedRecipes")}
              style={styles.heroBtn}
            />
          </HeroCard>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Recipes
            </Text>
            <Pressable
              onPress={refetch}
              hitSlop={10}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Ionicons name="refresh" size={20} color={theme.text} />
            </Pressable>
          </View>

          {isLoading ? (
             <View style={{ gap: 16, marginTop: 16 }}>
                 <Skeleton height={200} borderRadius={18} />
                 <Skeleton height={200} borderRadius={18} />
                 <Skeleton height={200} borderRadius={18} />
                 <Skeleton height={200} borderRadius={18} />
             </View>
          ) : (
            <RecipesSection
              recipes={allRecipes}
              isSaved={(id) => {
                 const r = allRecipes.find(x => x.id === id);
                 return r ? isRecipeSaved(r.recipe_name) : false;
              }}
              onToggleSave={toggleSave}
              onPressCook={(id) => {
                const recipe = allRecipes.find(r => r.id === id);
                if (recipe) {
                  router.push({
                    pathname: "/recipes/[id]",
                    params: { id, recipeData: JSON.stringify(recipe) }
                  });
                }
              }}
            />
          )}
          
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
