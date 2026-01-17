import { Ionicons } from "@expo/vector-icons";
import React from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { theme } from "@/constants/theme";
import { type ShoppingListItem } from "@/features/shoppingList/shoppingList.types";
import { itemsSectionStyles as styles } from "./ItemsSection.styles";
import ShoppingItemRow from "./ShoppingItemRow";

function ClearCheckedButton(props: {
  disabled?: boolean;
  onPress: () => void;
}) {

  return (
    <Button
      variant="primary"
      label="Clear Checked"
      onPress={props.onPress}
      disabled={props.disabled}
      leftIcon={<Ionicons name="trash-outline" size={16} color={theme.bg} />}
      style={styles.clearBtn}
    />
  );
}

export default function ItemsSection(props: {
  items: ShoppingListItem[];
  onToggle:(id:number,item:ShoppingListItem)=>void
}) {
  const { items,onToggle } = props;

  return (
    <Card theme={theme} padding={0} style={styles.card}>
      {items.map((item, idx) => (
        <ShoppingItemRow
          key={item.id}
          theme={theme}
          item={item}
          showDivider={idx !== 0}
          onToggle={() => {onToggle(item.id,item)}}
        />
      ))}
    </Card>
  );
}

ItemsSection.ClearCheckedButton = ClearCheckedButton;
