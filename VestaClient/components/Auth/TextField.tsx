import React from "react";
import { Text, TextInput, View } from "react-native";
import { Theme } from "@/type";
import { textFieldStyles as styles } from "./TextField.styles";

export default function TextField(props: {
  theme: Theme;
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (v: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "number-pad" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}) {
  const { theme } = props;

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: theme.textMuted }]}>
        {props.label}
      </Text>

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
          secureTextEntry={props.secureTextEntry}
          keyboardType={props.keyboardType ?? "default"}
          autoCapitalize={props.autoCapitalize ?? "none"}
          style={[styles.input, { color: theme.text }]}
          selectionColor={theme.primary}
          autoCorrect={false}
        />
      </View>
    </View>
  );
}
