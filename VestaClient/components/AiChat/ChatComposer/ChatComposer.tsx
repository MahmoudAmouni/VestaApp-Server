import React, { useCallback, useMemo } from "react";
import { Pressable, TextInput, View, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { Theme } from "@/type";
import { chatComposerStyles as styles } from "./ChatComposer.styles";

export default function ChatComposer(props: {
  theme: Theme;
  value: string;
  onChangeText: (v: string) => void;
  onSend: () => void;
  disabled?: boolean;
}) {
  const { theme } = props;

  const canSend = useMemo(() => props.value.trim().length > 0, [props.value]);
  const isDisabled = Boolean(props.disabled) || !canSend;

  const handleSend = useCallback(() => {
    if (isDisabled) return;
    props.onSend();
  }, [isDisabled, props]);

  return (
    <View style={[styles.wrap, { backgroundColor: theme.bg }]}>
      <View
        style={[
          styles.inputWrap,
          { backgroundColor: theme.surface2, borderColor: theme.border },
        ]}
      >
        <TextInput
          value={props.value}
          onChangeText={props.onChangeText}
          placeholder="Ask Vesta…"
          placeholderTextColor={theme.borderStrong}
          style={[styles.input, { color: theme.text }]}
          returnKeyType="send"
          onSubmitEditing={handleSend}
          editable={!props.disabled}
        />

        <Pressable
          onPress={handleSend}
          disabled={isDisabled}
          style={({ pressed }) => [
            styles.sendBtn,
            {
              backgroundColor: theme.primary,
              opacity: isDisabled ? 0.45 : pressed ? 0.86 : 1,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Send"
        >
          {props.disabled ? (
            <ActivityIndicator size="small" color={theme.bg} />
          ) : (
            <Ionicons name="send" size={16} color={theme.bg} />
          )}
        </Pressable>
      </View>
    </View>
  );
}
