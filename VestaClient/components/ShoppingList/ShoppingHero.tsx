import React from "react";
import { View } from "react-native";
import { Theme } from "@/type";

import HeroCard from "@/components/HeroCard";
import Button from "@/components/Button";

import { shoppingHeroStyles as styles } from "./ShoppingHero.styles";

export default function ShoppingHero(props: {
  theme: Theme;
  title: string;
  subtitle: string;
  onPressPantryGaps: () => void;
  onPressSavedRecipes: () => void;
}) {
  const { theme } = props;

  return (
    <HeroCard theme={theme} title={props.title} sub={props.subtitle} kpis={[]}>
      <View style={styles.btnRow}>
        <Button
          theme={theme}
          variant="secondary"
          label="From pantry gaps"
          onPress={props.onPressPantryGaps}
          style={styles.heroBtn}
        />
        <Button
          theme={theme}
          variant="secondary"
          label="For saved recipes"
          onPress={props.onPressSavedRecipes}
          style={styles.heroBtn}
        />
      </View>
    </HeroCard>
  );
}
