import { Theme } from "@/type";
import React from "react";

import { Pressable } from "react-native";
import Pill from "../ui/Pill";
import { deviceStatePillStyles as styles } from "./DeviceStatePill.styles";

export default function DeviceStatePill(props: {
  theme: Theme;
  state: "on" | "off";
  click:()=>void
}) {
  const { theme, state,click } = props;
  const isOn = state === "on";

  

  return (
    <Pressable onPress={click} >
      <Pill
        theme={theme}
        text={isOn ? "ON" : "OFF"}
        variant={isOn ? "primary" : "surface"}
        paddingX={12}
        paddingY={5}
        style={[
          styles.pill,
          !isOn && {
            backgroundColor: theme.surface,
            borderColor: theme.borderStrong ?? theme.border,
          },
        ]}
      />
    </Pressable>
  );
}
