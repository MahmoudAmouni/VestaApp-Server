import React from "react";
import { Modal, StyleSheet, View, TouchableWithoutFeedback } from "react-native";
import { Theme } from "@/type";
import ConfirmDeleteCard from "./ConfirmDeleteCard";

export default function ConfirmDeleteModal(props: {
  visible: boolean;
  theme: Theme;
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
  confirmLabel?: string;
  confirmIcon?: any;
}) {
  const { theme, visible, onConfirm, onCancel, message, confirmLabel, confirmIcon } = props;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.content,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <ConfirmDeleteCard
                theme={theme}
                onConfirm={onConfirm}
                onCancel={onCancel}
                message={message}
                confirmLabel={confirmLabel}
                confirmIcon={confirmIcon}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  content: {
    width: "100%",
    maxWidth: 340,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center", 
  },
});
