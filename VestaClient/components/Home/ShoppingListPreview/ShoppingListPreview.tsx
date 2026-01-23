import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { shoppingListPreviewStyles as styles } from "./ShoppingListPreview.styles";
import { Theme } from "@/type";
import { ShoppingListItem } from "@/features/shoppingList/shoppingList.types";
import { Ionicons } from "@expo/vector-icons";
import EmptyShoppingListState from "@/components/ShoppingList/EmptyShoppingListState";

interface ShoppingListPreviewProps {
  theme: Theme;
  items: ShoppingListItem[];
  onPressAction: () => void;
}

export default function ShoppingListPreview({ theme, items, onPressAction }: ShoppingListPreviewProps) {
  if (items.length === 0) {
    return (
      <EmptyShoppingListState 
        theme={theme} 
        onPressAction={onPressAction} 
        actionLabel="Go to Shopping List"
      />
    );
  }

  const previewItems = items.slice(0, 2);
  const remainingCount = Math.max(0, items.length - 2);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface2,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={styles.listContainer}>
        {previewItems.map((item) => (
          <View key={item.id} style={styles.itemRow}>
            <Ionicons
              name={item.is_checked ? "checkbox" : "square-outline"}
              size={20}
              color={item.is_checked ? theme.textMuted : theme.primary}
            />
            <Text
              style={[
                styles.itemText,
                {
                  color: item.is_checked ? theme.textMuted : theme.text,
                  textDecorationLine: item.is_checked ? "line-through" : "none",
                },
              ]}
              numberOfLines={1}
            >
              {item.item_name.name}
            </Text>
            <Text style={[styles.quantityText, { color: theme.textMuted }]}>
              {item.quantity} {item.unit.name}
            </Text>
          </View>
        ))}
      </View>

      {remainingCount > 0 && (
        <Text style={[styles.moreText, { color: theme.textMuted }]}>
          + {remainingCount} more items
        </Text>
      )}

      <TouchableOpacity
        onPress={onPressAction}
        activeOpacity={0.8}
        style={[styles.button, { backgroundColor: theme.surface }]}
      >
        <Text style={[styles.buttonText, { color: theme.primary }]}>
          Go to Shopping List
        </Text>
        <Ionicons name="arrow-forward" size={16} color={theme.primary} />
      </TouchableOpacity>
    </View>
  );
}

