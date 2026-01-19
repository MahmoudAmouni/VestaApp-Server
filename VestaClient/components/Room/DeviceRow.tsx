import { theme } from "@/constants/theme";
import { Device } from "@/features/rooms/rooms.types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { DeviceToggle } from "./DeviceToggle";
import { roomDetailsStyles as styles } from "./RoomDetailsScreen.styles";
import { useRooms } from "@/features/rooms/useRooms";
import { useAuth } from "@/contexts/auth/AuthContext";

export default function DeviceRow(p: {
  device: Device;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { session } = useAuth();
  const { toggleDevice } = useRooms(session?.homeId ?? 0, session?.token);
  const { device, onEdit, onDelete } = p;
  return (
    <View
      key={device.id}
      style={[
        styles.deviceRow,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
      ]}
    >
      <Text style={[styles.deviceName, { color: theme.text }]}>
        {device.device_name.name}
      </Text>

      <View style={styles.deviceRight}>
        <DeviceToggle
          theme={theme}
          on={device.is_on}
          onPress={() => {
            toggleDevice(device.id);
          }}
        />

        <Pressable
          onPress={onEdit}
          style={({ pressed }) => [
            styles.deviceIconBtn,
            {
              backgroundColor: theme.bg,
              borderColor: theme.border,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Ionicons name="create-outline" size={16} color={theme.textMuted} />
        </Pressable>

        <Pressable
          onPress={onDelete}
          style={({ pressed }) => [
            styles.deviceIconBtn,
            {
              backgroundColor: theme.bg,
              borderColor: theme.border,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Delete ${device.device_name.name}`}
        >
          <Ionicons name="trash-outline" size={16} color={theme.textMuted} />
        </Pressable>
      </View>
    </View>
  );
}
