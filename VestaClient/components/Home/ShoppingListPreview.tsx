import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Theme } from "@/type";
import { ShoppingListItem } from "@/features/shoppingList/shoppingList.types";
import { Ionicons } from "@expo/vector-icons";

interface ShoppingListPreviewProps {
  theme: Theme;
  items: ShoppingListItem[];
  onPressAction: () => void;
}

export default function ShoppingListPreview({ theme, items, onPressAction }: ShoppingListPreviewProps) {
  const previewItems = items.slice(0, 2);
  const remainingCount = Math.max(0, items.length - 2);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
      ]}
    >
      <View style={styles.listContainer}>
        {items.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.textMuted }]}>
            Your shopping list is empty.
          </Text>
        ) : (
          previewItems.map((item) => (
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
          ))
        )}
      </View>

      {remainingCount > 0 && (
        <Text style={[styles.moreText, { color: theme.textMuted }]}>
          + {remainingCount} more items
        </Text>
      )}

      <TouchableOpacity
        onPress={onPressAction}
        activeOpacity={0.8}
        style={[styles.button, { backgroundColor: theme.surface2 }]}
      >
        <Text style={[styles.buttonText, { color: theme.primary }]}>
          Go to Shopping List
        </Text>
        <Ionicons name="arrow-forward" size={16} color={theme.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  listContainer: {
    gap: 12,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  itemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
  },
  quantityText: {
    fontSize: 13,
    fontWeight: "500",
  },
  emptyText: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 10,
  },
  moreText: {
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 30, 
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
    marginTop: 4,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
