import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Theme } from "@/type";
import { recipeDetailHeaderStyles as styles } from "./RecipeDetailHeader.styles";

export default function RecipeDetailHeader(props: {
  theme: Theme;
  title: string;
  saved: boolean;
  onBack: () => void;
  onToggleSave: () => void;
}) {
  const { theme } = props;

  return (
    <View style={[styles.wrap, { backgroundColor: theme.bg }]}>
      <Pressable
        onPress={props.onBack}
        style={({ pressed }) => [
          styles.iconBtn,
          { opacity: pressed ? 0.85 : 1 },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Back"
      >
        <Ionicons name="chevron-back" size={18} color={theme.text} />
      </Pressable>

      <Text numberOfLines={1} style={[styles.title, { color: theme.text }]}>
        {props.title}
      </Text>

      <Pressable
        onPress={props.onToggleSave}
        style={({ pressed }) => [
          styles.iconBtn,
          { opacity: pressed ? 0.85 : 1 },
        ]}
        accessibilityRole="button"
        accessibilityLabel={props.saved ? "Unsave recipe" : "Save recipe"}
      >
        <Ionicons
          name={props.saved ? "star" : "star-outline"}
          size={18}
          color={theme.text}
        />
      </Pressable>
    </View>
  );
}
