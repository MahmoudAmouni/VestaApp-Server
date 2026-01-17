import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Theme } from "@/type";

import Pill from "@/components/Pill";

import { shoppingItemRowStyles as styles } from "./ShoppingItemRow.styles";
import { ShoppingListItem } from "@/features/shoppingList/shoppingList.types";

export default function ShoppingItemRow(props: {
  theme: Theme;
  item: ShoppingListItem;
  showDivider?: boolean;
  onToggle: () => void;
}) {
  const { theme, item } = props;
  const status = item.is_checked ? "Done" : "Needed"

  return (
    <Pressable
      onPress={props.onToggle}
      style={({ pressed }) => [
        styles.row,
        props.showDivider && {
          borderTopWidth: 1,
          borderTopColor: theme.border,
        },
        { opacity: pressed ? 0.9 : 1 },
      ]}
      accessibilityRole="button"
      accessibilityLabel={item.item_name.name}
    >
      <View style={styles.left}>
        <View
          style={[
            styles.checkbox,
            {
              backgroundColor: item.is_checked ? theme.primary : theme.bg,
              borderColor: item.is_checked ? theme.primary : theme.border,
            },
          ]}
        >
          {item.is_checked ? (
            <Text style={[styles.check, { color: theme.bg }]}>✓</Text>
          ) : null}
        </View>

        <View style={styles.textBlock}>
          <Text style={[styles.name, { color: theme.text }]}>
            {item.item_name.name}
          </Text>
        </View>
      </View>

      <Pill
        theme={theme}
        text={status}
        variant="surface"
        paddingX={12}
        paddingY={6}
        style={styles.statusPill}
      />
    </Pressable>
  );
}
