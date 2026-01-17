import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

import Button from "@/components/Button";
import Card from "@/components/Card";

import { RagRecipeResult } from "@/features/recipes/recipes.rag.types";
import { recipeCardStyles as styles } from "./RecipeCard.styles";
import { theme } from "@/constants/theme";

export default function RecipeCard(props: {
  recipe: RagRecipeResult;
  saved: boolean;
  onToggleSave: () => void;
  onPressCook: () => void;
}) {
  const { recipe } = props;
  const ingredients = recipe.ingredients.split("$$")

  return (
    <Card theme={theme} padding={14} style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.left}>
          <Text style={[styles.title, { color: theme.text }]}>
            {recipe.recipe_name}
          </Text>
          <View style={{ display: "flex", flexDirection: "row" }}>
            {ingredients?.map((n, i) => {
              if (i < 4)
                return (
                  <Text
                    key={n}
                    style={[styles.sub, { color: theme.textMuted }]}
                  >
                    {i === 3 ? "..." : n + ", "}
                  </Text>
                );
            })}
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

      <Button
        variant="primary"
        label="Cook Now"
        onPress={props.onPressCook}
        style={styles.cookBtn}
      />
    </Card>
  );
}
