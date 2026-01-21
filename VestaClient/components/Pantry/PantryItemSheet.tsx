import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { Theme } from "@/type";
import { makePantryItemSheetStyles } from "./PantryItemSheet.styles";
import { usePantryModal } from "@/contexts/PantryModalContext";
import { usePantryMutations } from "@/hooks/pantry/usePantryMutations";
import { useAuth } from "@/contexts/auth/AuthContext";
import Button from "../ui/Button";


export default function PantryItemSheet(props: {
  theme: Theme;
}) {
let {homeId }= useAuth();

  function toYyyyMmDd(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  const {
    theme,
  } = props;
  const {showModal,setShowModal,pantryItem} = usePantryModal()
  
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [showDate, setShowDate] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);

  let datePicker = new Date()
  const insets = useSafeAreaInsets();
  const styles = useMemo(
    () => makePantryItemSheetStyles(theme, insets.bottom),
    [theme, insets.bottom]
  );

  const { updateMutation, createMutation } = usePantryMutations({ homeId });
  useEffect(()=>{
    setName(pantryItem?.item_name?.name || "")
    setDate(pantryItem?.expiry_date || "")
    setQuantity(pantryItem?.quantity ? String(pantryItem.quantity) : "")
    setLocation(pantryItem?.location?.name || "")
    setUnit(pantryItem?.unit?.name || "")
    setInputError(null)
  },[pantryItem])
// function normalizeExpiryDate(date: string | Date | null | undefined) {
//   if (!date) return null;
//   if (typeof date === "string") return date; 
//   return date.toISOString().slice(0, 10);
// }


  function onPressSave() {
    setInputError(null);
    const dto = {
      item_name: name.trim(),
      location,
      unit,
      quantity: Number(quantity),
      expiry_date: "2026-08-12",
    };

    if (!dto.item_name) {
      setInputError("Please enter a name");
      return;
    }
    if (!Number.isFinite(dto.quantity)) return;

    if (pantryItem) {
      updateMutation.mutate({ pantryItemId: pantryItem.id, patch: dto });
    } else {
      createMutation.mutate({ dto });
    }
  }

  const translateY = useRef(new Animated.Value(520)).current;

  useEffect(() => {
    if (!showModal) return;
    translateY.setValue(520);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [showModal, translateY]);

  return (
    <Modal
      visible={showModal}
      transparent
      animationType="none"
      onRequestClose={() => setShowModal(false)}
    >
      <Pressable style={styles.backdrop} onPress={() => setShowModal(false)} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
          <View style={styles.handle} />

          <View style={styles.headerRow}>
            <Text style={styles.title}>
              {!pantryItem ? "Add pantry item" : "Edit pantry item"}
            </Text>

            <Pressable
              style={styles.pillBtn}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.pillBtnText}>Close</Text>
            </Pressable>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              value={name}
              onChangeText={(t) => {
                setName(t);
                if (inputError) setInputError(null);
              }}
              style={[
                styles.selectBox,
                {
                  color: "white",
                  borderColor: inputError ? theme.statusError : "transparent",
                  borderWidth: inputError ? 1 : 0,
                },
              ]}
              placeholder="e.g. Carrots"
              placeholderTextColor={theme.textMuted}
            />
            {inputError && (
              <Text style={{ color: theme.statusError, marginTop: 4, fontSize: 12 }}>
                {inputError}
              </Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Quantity + Unit</Text>
            <View style={styles.row}>
              <View style={styles.half}>
                <TextInput
                  value={quantity}
                  onChangeText={setQuantity}
                  placeholder="e.g. 2"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="numeric"
                  style={styles.input}
                />
              </View>

              <View style={styles.half}>
                <TextInput
                  value={unit}
                  onChangeText={setUnit}
                  placeholder="e.g. kg"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="numeric"
                  style={styles.input}
                />
              </View>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              value={location}
              onChangeText={setLocation}
              style={[
                styles.selectBox,
                {
                  color: "white",
                },
              ]}
              placeholder="e.g. Fridge"
              placeholderTextColor={theme.textMuted}
            ></TextInput>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Expiry date</Text>

            <Pressable
              style={styles.selectBox}
              onPress={() => setShowDate(!showDate)}
            >
              <Text style={date ? styles.selectText : styles.selectPlaceholder}>
                {date || "Select date..."}
              </Text>
              <Ionicons
                name="calendar-outline"
                size={18}
                color={theme.textMuted}
              />
            </Pressable>

            {showDate && (
              <DateTimePicker
                value={datePicker}
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "calendar"}
                onChange={(_, picked) => {
                  setShowDate(!showDate);
                  if (!picked) return;
                  setDate(toYyyyMmDd(picked));
                }}
              />
            )}
          </View>
          <View style={styles.actionsRow}>
            <Button
              variant="secondary"
              label="Cancel"
              onPress={() => setShowModal(false)}
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
