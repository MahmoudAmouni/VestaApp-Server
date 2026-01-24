import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/type";
import { emptySavedRecipesStateStyles as styles } from "./EmptySavedRecipesState.styles";

interface EmptySavedRecipesStateProps {
  theme: Theme;
  onPressAction: () => void;
  actionLabel?: string;
  title?: string;
  description?: string;
}

export default function EmptySavedRecipesState({ 
  theme, 
  onPressAction,
  actionLabel = "Explore Recipes",
  title = "No saved recipes yet",
  description = "Save recipes you love to find them easily later."
}: EmptySavedRecipesStateProps) {
  return (
    <View
      style={[
        styles.container,
        {
          borderColor: theme.border,
          backgroundColor: theme.surface,
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: theme.surface2 },
        ]}
      >
        <Ionicons name="bookmark-outline" size={24} color={theme.textMuted} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: theme.text }]}>
          {title}
        </Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          {description}
        </Text>
      </View>
      <TouchableOpacity
        onPress={onPressAction}
        activeOpacity={0.8}
        style={[styles.button, { backgroundColor: theme.primary }]}
      >
        <Text style={[styles.buttonText, { color: "#FFFFFF" }]}>
          {actionLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
