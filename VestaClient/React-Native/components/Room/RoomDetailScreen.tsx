import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { roomDetailsStyles as styles } from "./RoomDetailsScreen.styles";
import HeroCard from "@/React-Native/components/ui/HeroCard";
import RoomActions from "@/React-Native/components/Room/RoomActions";
import BulkActionButton from "@/React-Native/components/Room/BulkActionButton";
import ConfirmDeleteModal from "@/React-Native/components/Room/ConfirmDeleteModal";
import HeaderSecondary from "@/React-Native/components/ui/HeaderSecondary";
import { useRoomsQuery } from "@/React-Native/hooks/rooms/useRoomsQuery";
import { useRoomsMutations } from "@/React-Native/hooks/rooms/useRoomsMutations";
import { Device } from "@/React-Native/features/rooms/rooms.types";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import RoomSheet from "../Rooms/RoomSheet";
import DeviceRow from "./DeviceRow";
import DeviceSheet from "./DeviceSheet";
import { useAuth } from "@/React-Native/contexts/auth/AuthContext";
import { useTheme } from "@/React-Native/contexts/theme/ThemeContext";

export default function RoomDetailsScreen() {
  const { theme } = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const [openDeviceModal, setOpenDeviceModal] = useState(false);
  const [device, setDevice] = useState<Device | null>();
  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  const { id } = useLocalSearchParams<{ id: string }>();
  const roomId = Number(id);

  const { session } = useAuth();
  const homeId = session?.homeId ?? 0;
  const token = session?.token;
  
  const { data: rooms = [], isLoading } = useRoomsQuery({ homeId, token });
  const { 
    deleteRoomMutation, 
    deleteDeviceMutation, 
    turnRoomOnMutation, 
    turnRoomOffMutation 
  } = useRoomsMutations({ homeId, token });

  if (isLoading) return <Text>Loading...</Text>;
  let room = rooms.find((room) => room.id === roomId);

  function setShowDeviceModal(open: boolean, device?: Device | null) {
    setOpenDeviceModal(open);

    if (open) {
      if (device !== undefined) setDevice(device ?? null);
    } else {
      setDevice(null);
    }
  }

  const devicesOn = room?.devices?.filter((d) => d.is_on).length ?? 0;
  const devicesOff = room?.devices?.filter((d) => !d.is_on).length ?? 0;

  return (
    <View style={[styles.safe, { backgroundColor: theme.bg }]}>
      <View style={[styles.screen, { backgroundColor: theme.bg }]}>
        <HeaderSecondary
        theme={theme}
        title={room?.room_name.name || "Room"}
        onBack={() => router.back()}
        />

        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: 100 }]}
          showsVerticalScrollIndicator={false}
        >
          <HeroCard
            theme={theme}
            title={`${room?.room_name.name} control`}
            sub={`Toggle devices instantly. Control all ${room?.room_name.name.toLowerCase()} devices`}
            kpis={[
              { label: "Devices ON", value: devicesOn.toString() },
              { label: "Devices OFF", value: devicesOff.toString() },
              { label: "Quick Action", value: "All OFF" },
              { label: "Quick Action", value: "All ON" },
            ]}
          >
            <View style={styles.bulkRow}>
              <BulkActionButton
                theme={theme}
                label="All ON"
                onPress={() => turnRoomOnMutation.mutate({ roomId })}
              />
              <BulkActionButton
                theme={theme}
                label="All OFF"
                onPress={() => turnRoomOffMutation.mutate({ roomId })}
              />
            </View>
          </HeroCard>

          <View style={styles.sectionHead}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Devices
            </Text>
            <Pressable
              onPress={() => setShowDeviceModal(true)}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                paddingVertical: 6,
                paddingHorizontal: 12,
                backgroundColor: theme.surface2,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: theme.border,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Ionicons name="add" size={16} color={theme.textMuted} />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: theme.textMuted,
                }}
              >
                Add Device
              </Text>
            </Pressable>
          </View>

          <View style={styles.list}>
            {!room?.devices || room.devices.length === 0 ? (
              <View
                style={[
                  styles.emptyState,
                  { borderColor: theme.border, backgroundColor: theme.surface },
                ]}
              >
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 999,
                    backgroundColor: theme.surface2,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 4,
                  }}
                >
                  <Ionicons name="cube-outline" size={24} color={theme.textMuted} />
                </View>
                <View style={{ alignItems: "center", gap: 4 }}>
                  <Text style={[styles.emptyTitle, { color: theme.text }]}>
                    No devices added
                  </Text>
                  <Text style={[styles.emptySub, { color: theme.textMuted }]}>
                    This room is empty. Add a device to get started.
                  </Text>
                </View>
              </View>
            ) : (
              room.devices.map((device) => (
                <DeviceRow
                  device={device}
                  key={device.id}
                  onEdit={() => {
                    setShowDeviceModal(true, device);
                  }}
                  onDelete={() => setDeviceToDelete(device)}
                />
              ))
            )}
          </View>


        </ScrollView>

        <View style={{ paddingHorizontal: 14, paddingBottom: 14 }}>
            <RoomActions
            theme={theme}
            onEditRoom={() => {
                setOpenModal(true);
            }}
            onDeleteRoom={() => {
                setIsDeleting(true);
            }}
            />
        </View>

        <ConfirmDeleteModal
          visible={isDeleting}
          theme={theme}
          onCancel={() => setIsDeleting(false)}
          onConfirm={() => {
            setIsDeleting(false);
            deleteRoomMutation.mutate({ roomId });
            router.back();
          }}
        />

        <ConfirmDeleteModal
          visible={!!deviceToDelete}
          theme={theme}
          message={`Are you sure you want to delete ${deviceToDelete?.device_name.name}?`}
          onCancel={() => setDeviceToDelete(null)}
          onConfirm={() => {
            if (deviceToDelete) {
             deleteDeviceMutation.mutate({ deviceId: deviceToDelete.id, roomId })
             setDeviceToDelete(null);
            }
          }}
        />

        <RoomSheet
          visible={openModal}
          room={room}
          onClose={() => setOpenModal(false)}
        />
        <DeviceSheet
          roomId={roomId}
          visible={openDeviceModal}
          onClose={() => setShowDeviceModal(false)}
          device={device}
        />
      </View>
    </View>
  );
}
