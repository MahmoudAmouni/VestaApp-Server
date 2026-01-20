import { Device } from "@/features/rooms/rooms.types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { DeviceToggle } from "./DeviceToggle";
import { roomDetailsStyles as styles } from "./RoomDetailsScreen.styles";
import { useRoomsMutations } from "@/hooks/rooms/useRoomsMutations";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useTheme } from "@/contexts/theme/ThemeContext";

export default function DeviceRow(p: {
  device: Device;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { theme } = useTheme();
  const { session } = useAuth();
  const { updateDeviceMutation } = useRoomsMutations({ homeId: session?.homeId ?? 0, token: session?.token });
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
            updateDeviceMutation.mutate({
              roomId: device.room_id,
              deviceId: device.id,
              patch: { is_on: !device.is_on }
            });
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
