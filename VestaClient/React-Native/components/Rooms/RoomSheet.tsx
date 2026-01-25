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

import { useRoomsMutations } from "@/React-Native/hooks/rooms/useRoomsMutations";
import { Room } from "@/React-Native/features/rooms/rooms.types";
import { makeRoomSheetStyles } from "./RoomSheet.styles";
import { useAuth } from "@/React-Native/contexts/auth/AuthContext";
import { useTheme } from "@/React-Native/contexts/theme/ThemeContext";
import Button from "../ui/Button";

type Props = {
  visible: boolean;
  room?: Room;
  onClose: () => void;
};

export default function RoomSheet({
  visible,
  onClose,
  room,
}: Props) {
  const { theme } = useTheme();
  const { session } = useAuth();
  const { updateRoomMutation, createRoomMutation } = useRoomsMutations({ homeId: session?.homeId ?? 0, token: session?.token });
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const styles = useMemo(
    () => makeRoomSheetStyles(theme, insets.bottom),
    [insets.bottom]
  );
    useEffect(() => {
      if (visible && room) {
        setQuery(room?.room_name.name);
      } else if (!visible) {
        setQuery("");
      }
    }, [visible, room]);

  function onPressSave() {
    onClose();
    if(room) updateRoomMutation.mutate({ roomId: room.id, patch: {name:query} })
    else createRoomMutation.mutate({ dto: { room_name: query } });
    
  }
  

  const translateY = useRef(new Animated.Value(520)).current;

  useEffect(() => {
    if (!visible) return;
    translateY.setValue(520);
    Animated.timing(translateY, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [visible, translateY]);

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
            <Text style={styles.title}>{room ? "Edit Room" : "Add Room"}</Text>

            <Pressable style={styles.pillBtn} onPress={onClose}>
              <Text style={styles.pillBtnText}>Close</Text>
            </Pressable>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Room Name</Text>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={"e.g. Kithcen"}
              placeholderTextColor={theme.textMuted}
              style={styles.input}
              autoCorrect={false}
              autoCapitalize="words"
              returnKeyType="done"
            />
          </View>

          <View style={styles.actionsRow}>
            <Button
              variant="secondary"
              label="Cancel"
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
