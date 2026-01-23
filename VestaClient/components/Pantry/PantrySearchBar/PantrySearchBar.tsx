import { Theme } from "@/type";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TextInput, View } from "react-native";

import { pantrySearchBarStyles as styles } from "./PantrySearchBar.styles";

export default function PantrySearchBar(props: {
  theme: Theme;
  value: string;
  onChange: (v: string) => void;
  onSubmit?: () => void;
}) {
  const { theme ,value,onChange} = props;

  return (
    <View
      style={[
        styles.wrap,
        { backgroundColor: theme.surface2, borderColor: theme.border },
      ]}
    >
      <Ionicons name="search-outline" size={18} color={theme.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Search items..."
        placeholderTextColor={theme.textMuted}
        style={[styles.input, { color: theme.text }]}
        returnKeyType="search"
        onSubmitEditing={props.onSubmit}
      />
    </View>
  );
}
