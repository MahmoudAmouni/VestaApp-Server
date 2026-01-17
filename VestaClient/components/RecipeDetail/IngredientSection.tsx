import React, { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Theme } from "@/type";
import IngredientRow from "./IngredientRow";
import { ingredientsSectionStyles as styles } from "./IngredientsSection.styles";

export default function IngredientsSection(props: {
  theme: Theme;
  items: string[];
}) {
  const { theme, items } = props;

  const INITIAL = 3;
  const [visibleCount, setVisibleCount] = useState(INITIAL);

  const hasMore = items.length > INITIAL;
  const showingAll = visibleCount >= items.length;

  const visibleItems = useMemo(
    () => items.slice(0, visibleCount),
    [items, visibleCount]
  );

  return (
    <View style={styles.wrap}>
      <Text style={[styles.h, { color: theme.text }]}>Ingredients</Text>

      <View style={styles.list}>
        {visibleItems.map((it, i) => (
          <IngredientRow key={`${i}-${it}`} theme={theme} name={it} />
        ))}

        {hasMore ? (
          <Pressable
            onPress={() => setVisibleCount(showingAll ? INITIAL : items.length)}
            hitSlop={10}
          >
            <Text style={{ color: theme.textMuted }}>
              {showingAll ? "Show Less" : "Show More"}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
