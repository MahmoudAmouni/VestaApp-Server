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
import { Device } from "@/React-Native/features/rooms/rooms.types";
import { makeRoomSheetStyles } from "../Rooms/RoomSheet.styles";
import { useAuth } from "@/React-Native/contexts/auth/AuthContext";
import { useTheme } from "@/React-Native/contexts/theme/ThemeContext";
import Button from "@/React-Native/components/ui/Button";

type Props = {
  visible: boolean;
  onClose: () => void;
  device?: Device | null | undefined;
  roomId: number;
};

export default function DeviceSheet({
  visible,
  device,
  onClose,
  roomId,
}: Props) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(
    () => makeRoomSheetStyles(theme, insets.bottom),
    [insets.bottom]
  );
  const [name, setName] = useState("");
  const [ipAdress, setIpAdress] = useState("");
  
  const { session } = useAuth();
  const { createDeviceMutation, updateDeviceMutation } = useRoomsMutations({ homeId: session?.homeId ?? 0, token: session?.token });

  useEffect(() => {
    if (visible && device) {
      setName(device.device_name.name);
      setIpAdress(device.external_id);
    } else if (!visible) {
      setName("");
      setIpAdress("");
    }
  }, [visible, device]);

  const input2Ref = useRef<TextInput>(null);

  function onPressSave() {
    onClose();
    if(device) updateDeviceMutation.mutate({ roomId, deviceId: device.id, patch: {name,external_id:ipAdress} })
    else createDeviceMutation.mutate({ roomId, dto: { device_name: name, external_id: ipAdress } });
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
            <Text style={styles.title}>{device ? "Edit":"Add"}</Text>

            <Pressable style={styles.pillBtn} onPress={onClose}>
              <Text style={styles.pillBtnText}>Close</Text>
            </Pressable>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Device Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={"e.g. Fridge"}
              placeholderTextColor={theme.textMuted}
              style={styles.input}
              autoCorrect={false}
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => input2Ref.current?.focus()}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>{"Ip Address"}</Text>
            <TextInput
              ref={input2Ref}
              value={ipAdress}
              onChangeText={setIpAdress}
              placeholder={"device address"}
              placeholderTextColor={theme.textMuted}
              style={styles.input}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={onPressSave}
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
