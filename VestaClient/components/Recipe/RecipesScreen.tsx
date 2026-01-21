import { router } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, StatusBar, Text, View } from "react-native";
import {
  useSafeAreaInsets,
} from "react-native-safe-area-context";


import BottomNav from "@/components/ui/BottomNav";
import Button from "@/components/ui/Button";
import Header from "@/components/ui/Header";
import HeroCard from "@/components/ui/HeroCard";

import RecipesSection from "@/components/Recipe/RecipeSection";
import { recipesScreenStyles as styles } from "./recipe.styles";
import { useRecipesRag } from "@/features/recipes/useRecipesRag";
import { useTheme } from "@/contexts/theme/ThemeContext";


export default function RecipesScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const {isLoading,primaryResults} = useRecipesRag({mustContain:[],mustNotContain:[]})

  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({
    "4": true,
  });


  function toggleSave(id: string) {
    setSavedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  if(isLoading) return <Text>Loading...</Text>
  console.log(primaryResults)

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
            sub="Vesta pulls ideas from your pantry + world recipes."
            kpis={[
              { label: "Saved Recipes", value: "5" },
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

          <RecipesSection
            recipes={primaryResults}
            isSaved={(id) => savedIds[id]}
            onToggleSave={toggleSave}
            onPressCook={(id) => {
              router.push(`/recipes/${id}`);
            }}
          />
        </ScrollView>

        <BottomNav theme={theme} />
      </View>
    </SafeAreaView>
  );
}
