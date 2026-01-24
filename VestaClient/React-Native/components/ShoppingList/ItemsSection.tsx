import { Ionicons } from "@expo/vector-icons";
import React from "react";

import Button from "@/React-Native/components/ui/Button";
import Card from "@/React-Native/components/ui/Card";
import { useTheme } from "@/React-Native/contexts/theme/ThemeContext";
import { itemsSectionStyles as styles } from "./ItemsSection.styles";
import ShoppingItemRow from "./ShoppingItemRow";
import { ShoppingListItem } from "@/React-Native/features/shoppingList/shoppingList.types";

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
