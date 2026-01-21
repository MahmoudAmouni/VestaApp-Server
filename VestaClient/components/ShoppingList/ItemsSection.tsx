import { Ionicons } from "@expo/vector-icons";
import React from "react";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useTheme } from "@/contexts/theme/ThemeContext";
import { itemsSectionStyles as styles } from "./ItemsSection.styles";
import ShoppingItemRow from "./ShoppingItemRow";
import { ShoppingListItem } from "@/features/shoppingList/shoppingList.types";

function ClearCheckedButton(props: {
  disabled?: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();

  return (
    <Button
      variant="primary"
      label="Clear Checked"
      onPress={props.onPress}
      disabled={props.disabled}
      icon="trash-outline"
      style={styles.clearBtn}
    />
  );
}

export default function ItemsSection(props: {
  items: ShoppingListItem[];
  onToggle:(id:number,item:ShoppingListItem)=>void
}) {
  const { theme } = useTheme();
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
