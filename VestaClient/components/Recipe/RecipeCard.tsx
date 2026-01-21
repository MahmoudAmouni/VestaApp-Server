import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

import { RagRecipeResult } from "@/features/recipes/recipes.rag.types";
import { recipeCardStyles as styles } from "./RecipeCard.styles";
import { useTheme } from "@/contexts/theme/ThemeContext";

export default function RecipeCard(props: {
  recipe: RagRecipeResult;
  saved: boolean;
  onToggleSave: () => void;
  onPressCook: () => void;
}) {
  const { theme } = useTheme();
  const { recipe } = props;
  const [isAskingAi, setIsAskingAi] = useState(false);
  const ingredients = recipe.ingredients.split("$$")

  return (
    <Card theme={theme} padding={14} style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.left}>
          <Text style={[styles.title, { color: theme.text }]}>
            {recipe.recipe_name}
          </Text>
          <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
            {(() => {
              const MAX_CHARS = 40;
              const allIngredients = ingredients.join(", ");
              const truncated = allIngredients.length > MAX_CHARS 
                ? allIngredients.substring(0, MAX_CHARS) + "..." 
                : allIngredients;
              return (
                <Text style={[styles.sub, { color: theme.textMuted }]}>
                  {truncated}
                </Text>
              );
            })()}
          </View>

          <View style={styles.tagsRow}>
            {/* {recipe.ingredients.map((t) => (
              <Pill
                key={`${recipe.id}-${t}`}
                theme={theme}
                text={t}
                variant="surface"
                paddingX={10}
                paddingY={5}
                style={styles.tagPill}
              />
            ))} */}
          </View>
        </View>

        <View style={styles.right}>
          {/* <Pill
            theme={theme}
            text={recipe.badge}
            variant="surface"
            paddingX={10}
            paddingY={6}
            style={styles.badgePill}
          /> */}

          <Pressable
            onPress={props.onToggleSave}
            style={({ pressed }) => [
              styles.starBtn,
              {
                backgroundColor: theme.surface2,
                borderColor: theme.border,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={props.saved ? "Unsave recipe" : "Save recipe"}
          >
            <Ionicons
              name={props.saved ? "star" : "star-outline"}
              size={16}
              color={props.saved ? theme.primary : theme.text}
            />
          </Pressable>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <Button
          variant="primary"
          label="Cook Now"
          onPress={props.onPressCook}
          style={styles.cookBtn}
          icon="restaurant"
          flex
        />
        <Button
          variant="secondary"
          label="Ask AI"
          disabled={isAskingAi}
          onPress={() => {
            setIsAskingAi(true);
            router.push({
              pathname: "/(tabs)/ai",
              params: { recipeData: JSON.stringify(recipe) }
            });
            // Reset after a delay in case navigation is slow or they come back
            setTimeout(() => setIsAskingAi(false), 2000);
          }}
          style={styles.askAiBtn}
          icon="sparkles"
          flex
        />
      </View>
    </Card>
  );
}
