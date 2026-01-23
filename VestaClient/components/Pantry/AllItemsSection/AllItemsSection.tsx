import { Theme } from "@/type";
import React from "react";
import { Text, View } from "react-native";

import Button from "@/components/ui/Button";

import { PantryItem } from "@/features/pantry/pantry.types";
import { allItemsSectionStyles as styles } from "./AllItemsSection.styles";
import PantryItemCard from "../PantryItemCard/PantryItemCard";
import { usePantryModal } from "@/contexts/PantryModalContext";

export default function AllItemsSection(props: {
  theme: Theme;
  items: PantryItem[] | undefined;
  onDelete: (id: number) => void;
}) {
  const { theme, items, onDelete } = props;
  const {setShowModal} =usePantryModal()

  return (
    <>
      <View style={styles.section}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: theme.text }]}>All items</Text>

          <Button
            variant="primary"
            label="Add item"
            onPress={()=>setShowModal(true)}
            style={styles.addBtn}
          />
        </View>

        <View style={styles.list}>
          {items?.map((it) => (
            <PantryItemCard
              key={it.id}
              theme={theme}
              item={it}
              onDelete={() => onDelete(it.id)}
            />
          ))}
        </View>
      </View>
      
    </>
  );
}
