import React from "react";
import { View } from "react-native";
import { Theme } from "@/type";
import Button from "@/React-Native/components/ui/Button";
import { roomActionsStyles as styles } from "./RoomActions.styles";

export default function RoomActions(props: {
  theme: Theme;
  onEditRoom?: () => void;
  onDeleteRoom?: () => void;
}) {
  const { theme } = props;

  return (
    <View style={styles.row}>
      <Button
        variant="secondary"
        label="Edit Room"
        icon="create-outline"
        onPress={props.onEditRoom || (() => {})}
        flex
      />

      <Button
        variant="primary"
        label="Delete Room"
        icon="trash-outline"
        onPress={props.onDeleteRoom || (() => {})}
        flex
      />
    </View>
  );
}
