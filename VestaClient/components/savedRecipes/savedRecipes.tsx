import React, { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import BottomNav from "@/components/ui/BottomNav";
import HeroCard from "@/components/ui/HeroCard";

import SavedHeader from "@/components/savedRecipes/SavedHeader";
import SavedRecipesSearchBar from "@/components/savedRecipes/SavedRecipesSearchBar";
import SavedRecipesSection, {
  SavedRecipe,
} from "@/components/savedRecipes/SavedRecipesSection";
import { savedRecipesStyles as styles } from "./SavedRecipes.styles";
import { useTheme } from "@/contexts/theme/ThemeContext";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useSavedRecipesQuery } from "@/features/savedRecipes/savedRecipes.query";
import { useSavedRecipesMutations } from "@/features/savedRecipes/savedRecipes.mutations";
import { router } from "expo-router";

export default function SavedRecipesScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState("");

  const { session } = useAuth();
  const { data: saved = [], isLoading } = useSavedRecipesQuery({
    homeId: session?.homeId ?? 0,
    token: session?.token,
  });
  const { deleteByNameMutation } = useSavedRecipesMutations({
    homeId: session?.homeId ?? 0,
    token: session?.token,
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return saved;
    return saved.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.subtitle.toLowerCase().includes(q) ||
        r.badge.toLowerCase().includes(q)
    );
  }, [query, saved]);

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
              { label: "Saved Recipes", value: "3" },
              { label: "More Recipes ?", value: "Ask Ai" },
            ]}
          />

          <SavedRecipesSearchBar
            theme={theme}
            value={query}
            onChangeText={setQuery}
          />

            {/* recipes={filtered}
            onPressCook={(id) => {
              router.push("/recipes/recipeDetail");
            }}
            onToggleSave={(name) => {
               deleteByNameMutation.mutate({ name });
            }} */}
          {/* /> */}
        </ScrollView>

        <BottomNav theme={theme} />
      </View>
    </SafeAreaView>
  );
}
