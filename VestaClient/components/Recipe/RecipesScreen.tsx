import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StatusBar, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  useSafeAreaInsets,
} from "react-native-safe-area-context";


import BottomNav from "@/components/ui/BottomNav";
import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import HeroCard from "@/components/ui/HeroCard";
import Skeleton from "@/components/ui/Skeleton";

import RecipesSection from "@/components/Recipe/RecipeSection";
import { recipesScreenStyles as styles } from "./recipe.styles";
import { useRecipesRag } from "@/features/recipes/useRecipesRag";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useTheme } from "@/contexts/theme/ThemeContext";
import { useSavedRecipesQuery } from "@/hooks/savedRecipes/useSavedRecipesQuery";
import { useCreateSavedRecipe } from "@/hooks/savedRecipes/mutations/useCreateSavedRecipe";
import { useDeleteSavedRecipe } from "@/hooks/savedRecipes/mutations/useDeleteSavedRecipe";

export default function RecipesScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { session } = useAuth();
  const token = session?.token;
  const { isLoading, primaryResults, refetch } = useRecipesRag({
    token,
    mustContain: [],
    mustNotContain: [],
  });


  const { data: savedRecipes = [] } = useSavedRecipesQuery({ homeId: session?.homeId ?? 0, token });
  const { mutate: saveRecipe } = useCreateSavedRecipe({ homeId: session?.homeId ?? 0, token });
  const { mutate: deleteRecipe } = useDeleteSavedRecipe({ homeId: session?.homeId ?? 0, token });

  function isRecipeSaved(name: string) {
    return savedRecipes.some((r) => r.recipe_name === name);
  }

  function toggleSave(id: string) {
    const recipe = primaryResults.find((r) => r.id === id);
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
  
  if(isLoading && !primaryResults.length) {
       // logic handled below
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
             </View>
          ) : (
            <RecipesSection
              recipes={primaryResults}
              isSaved={(id) => {
                 const r = primaryResults.find(x => x.id === id);
                 return r ? isRecipeSaved(r.recipe_name) : false;
              }}
              onToggleSave={toggleSave}
              onPressCook={(id) => {
                router.push(`/recipes/${id}`);
              }}
            />
          )}
          
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
