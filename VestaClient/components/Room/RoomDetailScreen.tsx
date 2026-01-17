import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { roomDetailsStyles as styles } from "./RoomDetailsScreen.styles";

import BottomNav from "@/components/BottomNav";
import Card from "@/components/Card";
import HeroCard from "@/components/HeroCard";
import QuickActionTile from "@/components/Room/QuickActionTile";
import RoomActions from "@/components/Room/RoomActions";
import RoomHeader from "@/components/Room/RoomHeader";
import { theme } from "@/constants/theme";
import { useRooms } from "@/contexts/rooms/RoomsContext";
import { Device } from "@/features/rooms/rooms.types";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import RoomSheet from "../Rooms/RoomSheet";
import DeviceRow from "./DeviceRow";
import DeviceSheet from "./DeviceSheet";

export default function RoomDetailsScreen() {
  const [openModal, setOpenModal] = useState(false);
  const [openDeviceModal, setOpenDeviceModal] = useState(false);
  const [device, setDevice] = useState<Device | null>();

  const { id } = useLocalSearchParams<{ id: string }>();
  const roomId = Number(id);
  const { rooms, isLoading, deleteRoom,deleteDevice } = useRooms()

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

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <View style={[styles.screen, { backgroundColor: theme.bg }]}>
        <RoomHeader
          theme={theme}
          title={room?.room_name.name || ""}
          onBack={() => {
            router.back();
          }}
          onAddDevice={() => {
            setShowDeviceModal(true);
          }}
        />

        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: 118 }]}
          showsVerticalScrollIndicator={false}
        >
          <HeroCard
            theme={theme}
            title="Kitchen control"
            sub="Toggle devices instantly. Control all kitchen devices"
          >
            <View style={styles.tiles}>
              <QuickActionTile
                theme={theme}
                label="Devices ON"
                value={`${2}`}
              />
              <QuickActionTile
                theme={theme}
                label="Devices OFF"
                value={`${2}`}
              />
              <QuickActionTile
                theme={theme}
                label="Quick Action"
                value="All OFF"
                onPress={() => {}}
              />
              <QuickActionTile
                theme={theme}
                label="Quick Action"
                value="All ON"
                onPress={() => {}}
              />
            </View>

            <View style={styles.bulkRow}>
              <Pressable
                onPress={() => {}}
                style={({ pressed }) => [
                  styles.bulkBtn,
                  {
                    backgroundColor: theme.bg,
                    borderColor: theme.border,
                    opacity: pressed ? 0.9 : 1,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel="All ON"
              >
                <Text style={[styles.bulkText, { color: theme.text }]}>
                  All ON
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {}}
                style={({ pressed }) => [
                  styles.bulkBtn,
                  {
                    backgroundColor: theme.bg,
                    borderColor: theme.border,
                    opacity: pressed ? 0.9 : 1,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel="All OFF"
              >
                <Text style={[styles.bulkText, { color: theme.text }]}>
                  All OFF
                </Text>
              </Pressable>
            </View>
          </HeroCard>

          <View style={styles.sectionHead}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Devices
            </Text>
          </View>

          <View style={styles.list}>
            {room?.devices?.map((device) => (
              <DeviceRow
                device={device}
                key={device.id}
                onEdit={() => {
                  setShowDeviceModal(true, device);
                }}
                onDelete={() => deleteDevice(device.id,roomId)}
              />
            ))}
          </View>

          <Card theme={theme} padding={12} radius={16} noShadow>
            <RoomActions
              theme={theme}
              onEditRoom={() => {
                setOpenModal(true);
              }}
              onDeleteRoom={() => {
                deleteRoom(roomId);
                router.back();
              }}
            />
          </Card>
        </ScrollView>

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
        <BottomNav theme={theme} />
      </View>
    </SafeAreaView>
  );
}
