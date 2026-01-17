import React from "react";
import { Text, View } from "react-native";
import { Theme } from "@/type";

import InlineInputActionRow from "./InlineInputActionRow";
import TagRow from "./TagRow";

import { tagsManagerStyles as styles } from "./TagsManagerSection.styles";

export default function TagsManagerSection(props: {
  theme: Theme;
  title: string;

  inputValue: string;
  onChangeInput: (v: string) => void;
  inputPlaceholder: string;

  actionLabel: string;
  onAdd: () => void;

  items: string[];
  onRemove: (name: string) => void;
}) {
  const { theme } = props;

  return (
    <View style={styles.wrap}>
      <Text style={[styles.title, { color: theme.text }]}>{props.title}</Text>

      <InlineInputActionRow
        theme={theme}
        value={props.inputValue}
        onChangeText={props.onChangeInput}
        placeholder={props.inputPlaceholder}
        actionLabel={props.actionLabel}
        onPressAction={props.onAdd}
      />

      <View style={styles.list}>
        {props.items.map((name) => (
          <TagRow
            key={`${props.title}-${name}`}
            theme={theme}
            label={name}
            onRemove={() => props.onRemove(name)}
          />
        ))}
      </View>
    </View>
  );
}
