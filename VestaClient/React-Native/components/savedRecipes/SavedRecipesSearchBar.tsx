import React from "react";
import { TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/type";

import { savedRecipesSearchBarStyles as styles } from "./SavedRecipesSearchBar.styles";

export default function SavedRecipesSearchBar(props: {
  theme: Theme;
  value: string;
  onChangeText: (v: string) => void;
}) {
  const { theme } = props;

  return (
    <View
      style={[
        styles.wrap,
        { backgroundColor: theme.surface2, borderColor: theme.border },
      ]}
    >
      <Ionicons name="search-outline" size={18} color={theme.textMuted} />
      <TextInput
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder="Search Recipes..."
        placeholderTextColor={theme.textMuted}
        style={[styles.input, { color: theme.text }]}
        returnKeyType="search"
      />
    </View>
  );
}
