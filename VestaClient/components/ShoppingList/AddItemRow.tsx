import React from "react";
import { View } from "react-native";

import Button from "@/components/ui/Button";

import { theme } from "@/constants/theme";
import { addItemRowStyles as styles } from "./AddItemRow.styles";

export default function AddItemRow(props: { onPress: () => void }) {
  const {onPress} = props
  return (
    <View style={styles.row}>
      <View
        style={[
          styles.inputWrap,
          { backgroundColor: theme.surface2, borderColor: theme.border },
        ]}
      ></View>

      <Button
        variant="primary"
        label="Save"
        onPress={onPress}
        style={styles.saveBtn}
      />
    </View>
  );
}
