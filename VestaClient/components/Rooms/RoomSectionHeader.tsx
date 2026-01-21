import React from "react";
import { StyleProp, Text, View, ViewStyle } from "react-native";
import { Theme } from "@/type";


import { roomsSectionHeaderStyles as styles } from "./RoomSectionHeader.styles";
import SmallButton from "../ui/SmallButton";

export default function RoomsSectionHeader(props: {
  theme: Theme;
  title: string;
  actionLabel: string;
  onPressAction: () => void;
  titleSize?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { theme } = props;
  const titleSize = props.titleSize ?? 16;

  return (
    <View style={[styles.row, props.style]}>
      <Text
        style={[
          styles.title,
          { color: theme.text, fontSize: titleSize },
        ]}
      >
        {props.title}
      </Text>
      <SmallButton
        label={props.actionLabel}
        onPress={props.onPressAction}
      />
    </View>
  );
}
