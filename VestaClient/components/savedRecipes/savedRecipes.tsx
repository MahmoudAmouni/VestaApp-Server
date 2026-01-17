import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { Theme } from "@/type";

import BottomNav from "@/components/BottomNav";
import HeroCard from "@/components/HeroCard";

import SavedHeader from "@/components/savedRecipes/SavedHeader";
import SavedRecipesSearchBar from "@/components/savedRecipes/SavedRecipesSearchBar";
import SavedRecipesSection, {
  SavedRecipe,
} from "@/components/savedRecipes/SavedRecipesSection";
import { savedRecipesStyles as styles } from "./SavedRecipes.styles";

export default function SavedRecipesScreen() {
  const darktheme: Theme = (globalThis as any).theme ?? {
    bg: "#0f0f12",
    surface: "#15151b",
    surface2: "#1b1b23",
    text: "#f3f3f6",
    textMuted: "rgba(243, 243, 246, 0.68)",
    border: "rgba(255,255,255,0.10)",
    borderStrong: "rgba(255,255,255,0.16)",
    primary: "#c45b3d",
    navBg: "rgba(15, 15, 18, 0.82)",
    shadow1: "rgba(0,0,0,0.35)",
  };
  const theme = darktheme;
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState("");

  const saved: SavedRecipe[] = useMemo(
    () => [
      {
        id: "2",
        title: "Yogurt Herb Dip + Toast",
        subtitle: "Matches: yogurt • spices • bread",
        badge: "From Pantry",
        tags: ["Quick", "Vegetarian"],
      },
      {
        id: "3",
        title: "Spaghetti Aglio e Olio",
        subtitle: "Garlic, olive oil, chili",
        badge: "Italy",
        tags: ["High protein", "Healthy", "Spicy"],
      },
      {
        id: "4",
        title: "Tacos de Pollo",
        subtitle: "Crisp, juicy, bright toppings.",
        badge: "Mexico",
        tags: ["High protein", "Healthy", "Spicy"],
      },
    ],
    []
  );

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

          <SavedRecipesSection
            theme={theme}
            recipes={filtered}
            onPressCook={(id) => {
              router.push("/recipes/recipeDetail");
            }}
            onToggleSave={(id) => {}}
          />
        </ScrollView>

        <BottomNav theme={theme} />
      </View>
    </SafeAreaView>
  );
}
