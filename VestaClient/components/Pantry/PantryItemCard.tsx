import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "@/type";

import Card from "@/components/ui/Card";
import Pill from "@/components/ui/Pill";

import { pantryItemCardStyles as styles } from "./PantryItemCard.styles";
import { PantryItem } from "@/features/pantry/pantry.types";
import { daysFromToday } from "@/utils/dateHelpers";
import { usePantryModal } from "@/contexts/PantryModalContext";

export default function PantryItemCard(props: {
  theme: Theme;
  item: PantryItem;
  onDelete: () => void;
}) {
  const { theme, item, onDelete } = props;
  const days = daysFromToday(item.expiry_date)
  const {setShowModal} = usePantryModal()

  return (
    <Card theme={theme} padding={14} style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.left}>
          <Text style={[styles.name, { color: theme.text }]}>
            {item.item_name?.name ? item.item_name.name.charAt(0).toUpperCase() + item.item_name.name.slice(1) : ""}
          </Text>
          <Text style={[styles.meta, { color: theme.textMuted }]}>
            {item.location?.name}{item.unit?.name ? ` • ${item.quantity} ${item.unit.name}` : ""}
          </Text>
        </View>

        <Pill
          theme={theme}
          text={String(days < 30 ? days + " days" : "30+ days")}
          variant="surface"
          paddingX={12}
          paddingY={6}
        />
      </View>

      <View style={styles.actionsRow}>
        <Pressable
          onPress={()=> setShowModal(true,item)}
          style={({ pressed }) => [
            styles.actionBtn,
            {
              backgroundColor: theme.bg,
              borderColor: theme.border,
              opacity: pressed ? 0.86 : 1,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Edit item"
        >
          <Ionicons name="pencil" size={16} color={theme.textMuted} />
        </Pressable>

        <Pressable
          onPress={onDelete}
          style={({ pressed }) => [
            styles.actionBtn,
            {
              backgroundColor: theme.primary,
              borderColor: theme.primary,
              opacity: pressed ? 0.86 : 1,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Delete item"
        >
          <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
        </Pressable>
      </View>
    </Card>
  );
}
