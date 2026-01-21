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
import Skeleton from "@/components/ui/Skeleton";

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

          {isLoading ? (
             <View style={{ gap: 16, marginTop: 16 }}>
                 <Skeleton height={200} borderRadius={18} />
                 <Skeleton height={200} borderRadius={18} />
             </View>
          ) : (
            <RecipesSection
              recipes={primaryResults}
              isSaved={(id) => savedIds[id]}
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
