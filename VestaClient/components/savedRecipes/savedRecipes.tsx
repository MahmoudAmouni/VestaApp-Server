import React, { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import HeroCard from "@/components/ui/HeroCard";

import SavedHeader from "@/components/savedRecipes/SavedHeader";
import SavedRecipesSearchBar from "@/components/savedRecipes/SavedRecipesSearchBar";
import SavedRecipesSection, {
  SavedRecipe,
} from "@/components/savedRecipes/SavedRecipesSection";
import EmptySavedRecipesState from "@/components/savedRecipes/EmptySavedRecipesState";
import { savedRecipesStyles as styles } from "./SavedRecipes.styles";
import { useTheme } from "@/contexts/theme/ThemeContext";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useSavedRecipesQuery } from "@/hooks/savedRecipes/useSavedRecipesQuery";
import { useSavedRecipesMutations } from "@/hooks/savedRecipes/useSavedRecipesMutations";
import { router } from "expo-router";

export default function SavedRecipesScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState("");

  const { session } = useAuth();
  const { data: savedRaw = [], isLoading } = useSavedRecipesQuery({
    homeId: session?.homeId ?? 0,
    token: session?.token,
  });


  const { deleteByNameMutation } = useSavedRecipesMutations({
    homeId: session?.homeId ?? 0,
    token: session?.token,
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return savedRaw;
    return savedRaw.filter(
      (r) =>
        r.recipe_name.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q)) ||
        (r.cuisine_primary && r.cuisine_primary.toLowerCase().includes(q))
    );
  }, [query, savedRaw]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <View style={styles.screen}>
        <SavedHeader theme={theme} title="Saved" onBack={() => router.back()} />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: 110 + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <HeroCard
            theme={theme}
            title="Saved for later."
            sub="Your favorite ideas, ready when you are."
            kpis={[
              { label: "Saved Recipes", value: String(savedRaw.length) },
              { label: "More Recipes ?", value: "Ask Ai" },
            ]}
          />

          {filtered.length === 0 && !query ? (
            <EmptySavedRecipesState
              theme={theme}
              onPressAction={() => router.push("/recipes")}
            />
          ) : (
            <>
              <SavedRecipesSearchBar
                theme={theme}
                value={query}
                onChangeText={setQuery}
              />
              <SavedRecipesSection
                theme={theme}
                recipes={filtered}
                onPressCook={(id) => {
                  const found = savedRaw.find((r) => r.id === id);
                  if (found) {
                    const recipeData = {
                      id: String(found.id),
                      recipe_name: found.recipe_name,
                      cuisine_primary: found.cuisine_primary || undefined,
                      description: found.description || "",
                      ingredients: found.ingredients,
                      directions: found.directions,
                      cuisines: [],
                    };
                    router.push({
                      pathname: `/recipes/${id}`,
                      params: { recipeData: JSON.stringify(recipeData) }
                    });
                  }
                }}
                onToggleSave={(id) => {
                  const found = savedRaw.find((r) => String(r.id) === id);
                  if (found) {
                    deleteByNameMutation.mutate({ recipeName: found.recipe_name });
                  }
                }}
              />
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
