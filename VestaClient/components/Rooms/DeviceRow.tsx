import { Theme } from "@/type";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

import { Device } from "@/features/rooms/rooms.types";
import { deviceRowStyles as styles } from "./DeviceRow.styles";
import DeviceStatePill from "./DeviceStatePill";
import { useRooms } from "@/contexts/rooms/RoomsContext";

export default function DeviceRow(props: {
  theme: Theme;
  device: Device;
  roomId: number;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}) {
  const { toggleDevice } = useRooms();

  const { theme, device, roomId } = props;

  function handleToggle() {
    toggleDevice(device.id, roomId);
  }

  return (
    <View
      style={[
        styles.row,
        { backgroundColor: theme.surface2, borderColor: theme.border },
      ]}
    >
      <View style={styles.main}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {device.device_name.name}
        </Text>
      </View>

      <View style={styles.right}>
        <DeviceStatePill
          click={handleToggle}
          theme={theme}
          state={device.is_on ? "on" : "off"}
        />

        {!!props.onEdit && (
          <Pressable
            onPress={() => props.onEdit?.(device.id)}
            style={({ pressed }) => [
              styles.iconBtn,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Edit ${device.device_name}`}
          >
            <Ionicons name="pencil-outline" size={16} color={theme.textMuted} />
          </Pressable>
        )}

        {!!props.onDelete && (
          <Pressable
            onPress={() => props.onDelete?.(device.id)}
            style={({ pressed }) => [
              styles.iconBtn,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Delete ${device.id}`}
          >
            <Ionicons name="trash-outline" size={16} color={theme.textMuted} />
          </Pressable>
        )}
      </View>
    </View>
  );
}
