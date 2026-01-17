import React from "react";
import { Text, View } from "react-native";

import { Theme } from "@/type";
import StepCard from "./StepCard";

import { stepsSectionStyles as styles } from "./StepsSection.styles";


export default function StepsSection(props: {
  theme: Theme;
  steps: string[];
}) {
  const { theme } = props;

  return (
    <View style={styles.wrap}>
      <Text style={[styles.h, { color: theme.text }]}>Steps</Text>

      <View style={styles.list}>
        {props.steps.map((s, idx) => (
          <StepCard
            key={`${idx}-${s}`}
            index={idx + 1}
            title={s}
          />
        ))}
      </View>
    </View>
  );
}
