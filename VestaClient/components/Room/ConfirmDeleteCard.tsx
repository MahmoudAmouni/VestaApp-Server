import React from "react";
import { Text, View } from "react-native";
import { Theme } from "@/type";
import Button from "@/components/ui/Button";

export default function ConfirmDeleteCard(props: {
  theme: Theme;
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
  confirmLabel?: string;
  confirmIcon?: any;
}) {
  const { theme } = props;

  return (
    <View style={{ gap: 12 }}>
      <Text
        style={{
          color: theme.text,
          fontSize: 14,
          fontWeight: "600",
          textAlign: "center",
        }}
      >
        {props.message || "Are you sure you want to delete this room?"}
      </Text>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Button
          variant="secondary"
          label="Cancel"
          onPress={props.onCancel}
          flex
        />
        <Button
          variant="primary"
          label={props.confirmLabel || "Confirm"}
          icon={props.confirmIcon || "trash-outline"}
          onPress={props.onConfirm}
          flex
        />
      </View>
    </View>
  );
}
