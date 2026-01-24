import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "@/React-Native/contexts/theme/ThemeContext";
import { useShoppingListMutations } from "@/React-Native/hooks/shoppingList/useShoppingListMutations";
import { makeShoppingItemSheetStyles } from "./ShoppingItemSheet.styles";
import Button from "../ui/Button";



type Props = {
  visible: boolean;
  onClose: () => void;
  onSave:({
    name,
    unit,
    quantity,
  }: {
    name: string;
    unit: string;
    quantity: string;
  })=>void
};

export default function ShoppingItemSheet({
  onSave,
  visible,
  onClose,
}: Props) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const styles = useMemo(
    () => makeShoppingItemSheetStyles(theme, insets.bottom),
    [insets.bottom]
  );

  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [name, setName] = useState("");

  function onPressSave(){
    onSave({name,quantity,unit})
    onClose()
  }

  const translateY = useRef(new Animated.Value(520)).current;

  useEffect(() => {
    if (!visible) {
      setName("");
      setQuantity("");
      setUnit("");
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    translateY.setValue(520);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [visible, translateY]);

  const sheetTitle = "Add Item";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          <View style={styles.handle} />

          <View style={styles.headerRow}>
            <Text style={styles.title}>{sheetTitle}</Text>

            <Pressable style={styles.pillBtn} onPress={onClose}>
              <Text style={styles.pillBtnText}>Close</Text>
            </Pressable>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Item Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={"e.g. Eggs"}
              placeholderTextColor={theme.textMuted}
              style={styles.input}
              autoCorrect={false}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Quantity</Text>
            <TextInput
              value={quantity}
              onChangeText={setQuantity}
              placeholder={"0"}
              placeholderTextColor={theme.textMuted}
              style={styles.input}
              keyboardType={Platform.OS === "ios" ? "number-pad" : "numeric"}
              returnKeyType="done"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Unit</Text>
            <TextInput
              value={unit}
              onChangeText={setUnit}
              placeholder={"e.g. piece"}
              placeholderTextColor={theme.textMuted}
              style={styles.input}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="next"
            />
          </View>

          <View style={styles.actionsRow}>
            <Button
              variant="secondary"
              label="Close"
              onPress={onClose}
              flex
            />
            <Button
              variant="primary"
              label="Save"
              onPress={onPressSave}
              flex
            />
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
