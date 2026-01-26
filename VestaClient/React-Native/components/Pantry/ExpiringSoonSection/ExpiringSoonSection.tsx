import { Theme } from "@/type";
import React from "react";
import { Text, View } from "react-native";

import Card from "@/components/ui/Card";
import Pill from "@/components/ui/Pill";

import { expiringSoonSectionStyles as styles } from "./ExpiringSoonSection.styles";
import { PantryItem } from "@/features/pantry/pantry.types";
import { daysFromToday } from "@/utils/dateHelpers";
import { useTheme } from "@/contexts/theme/ThemeContext";


export default function ExpiringSoonSection(props: {
  items: PantryItem[];
}) {
  const { theme } = useTheme();
  const { items } = props;

  return (
    <View style={styles.section}>
      <Card theme={theme} padding={0} style={styles.card}>
        {items.length === 0 ? (
          <View style={{ padding: 16, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: theme.textMuted, fontSize: 14, fontWeight:"600" }}>
              Everything looks fresh!
            </Text>
          </View>
        ) : (
          items.map((item, i) => {
            const showDivider = i !== 0;
            const exp = daysFromToday(item.expiry_date);

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
                  text={
                    exp === 1 ? "Tomorrow" : exp > 1 ? `${exp} days` : "expired"
                  }
                  variant="surface"
                  paddingX={12}
                  paddingY={6}
                  style={styles.badge}
                />
              </View>
            );
          })
        )}
      </Card>
    </View>
  );
}
