import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/type";
import { emptyShoppingListStateStyles as styles } from "./EmptyShoppingListState.styles";

interface EmptyShoppingListStateProps {
  theme: Theme;
  onPressAction?: () => void;
  actionLabel?: string;
}

export default function EmptyShoppingListState({ 
  theme, 
  onPressAction,
  actionLabel = "Add Item"
}: EmptyShoppingListStateProps) {
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
        <Ionicons name="cart-outline" size={24} color={theme.textMuted} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: theme.text }]}>
          Your list is empty
        </Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          Add items you need to buy or let Vesta suggest some for you.
        </Text>
      </View>
      {onPressAction && (
        <TouchableOpacity
          onPress={onPressAction}
          activeOpacity={0.8}
          style={[styles.button, { backgroundColor: theme.primary }]}
        >
          <Text style={[styles.buttonText, { color: "#FFFFFF" }]}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
