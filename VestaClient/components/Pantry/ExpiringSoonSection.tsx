import { Theme } from "@/type";
import React from "react";
import { Text, View } from "react-native";

import Card from "@/components/ui/Card";
import Pill from "@/components/ui//Pill";

import { expiringSoonSectionStyles as styles } from "./ExpiringSoonSection.styles";
import { PantryItem } from "@/features/pantry/pantry.types";
import { daysFromToday } from "@/utils/dateHelpers";
import { theme } from "@/constants/theme";


export default function ExpiringSoonSection(props: {
  items: PantryItem[];
}) {
  const { items } = props;

  
  return (
    <View style={styles.section}>
      <Text style={[styles.title, { color: theme.text }]}>Expiring Soon</Text>

      <Card theme={theme} padding={0} style={styles.card}>
        {items.map((item, i) => {
          const showDivider = i !== 0;
          const exp =daysFromToday(item.expiry_date)

          return (
            <View
              key={`${item.item_name.name}-${i}`}
              style={[
                styles.row,
                showDivider && {
                  borderTopColor: theme.border,
                  borderTopWidth: 1,
                },
              ]}
            >
              <View style={styles.left}>
                <Text style={[styles.name, { color: theme.text }]}>
                  {item.item_name.name}
                </Text>
                <Text style={[styles.meta, { color: theme.textMuted }]}></Text>
              </View>

              <Pill
                theme={theme}
                text={ exp === 1 ?  "Tomorrow" : exp > 1 ? `${exp} days` : "expired"}
                variant="surface"
                paddingX={12}
                paddingY={6}
                style={styles.badge}
              />
            </View>
          );
        })}
      </Card>
    </View>
  );
}
