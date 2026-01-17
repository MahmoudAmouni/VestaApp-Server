import React from "react";
import { TextInput, View } from "react-native";

import { Theme } from "@/type";
import Button from "@/components/Button";

import { inlineInputActionRowStyles as styles } from "./InlineInputActionRow.styles";

export default function InlineInputActionRow(props: {
  theme: Theme;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  actionLabel: string;
  onPressAction: () => void;
}) {
  const { theme } = props;

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.inputWrap,
          { backgroundColor: theme.surface2, borderColor: theme.border },
        ]}
      >
        <TextInput
          value={props.value}
          onChangeText={props.onChangeText}
          placeholder={props.placeholder}
          placeholderTextColor={theme.textMuted}
          style={[styles.input, { color: theme.text }]}
        />
      </View>

      <Button
        theme={theme}
        variant="primary"
        label={props.actionLabel}
        onPress={props.onPressAction}
        style={styles.actionBtn}
      />
    </View>
  );
}
