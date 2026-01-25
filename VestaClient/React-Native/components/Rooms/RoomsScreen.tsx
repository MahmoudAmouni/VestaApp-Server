import React, { useMemo, useState } from "react";
import { SafeAreaView, ScrollView, StatusBar, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BottomNav from "@/React-Native/components/ui/BottomNav";
import RoomCard from "@/React-Native/components/Rooms/RoomCard";
import EmptyRoomState from "@/React-Native/components/Rooms/EmptyRoomState";
import RoomsSectionHeader from "@/React-Native/components/Rooms/RoomSectionHeader";
import HeroCard from "@/React-Native/components/ui/HeroCard";

import Header from "@/React-Native/components/ui/Header";
import { useRouter } from "expo-router";
import { roomsStyles as styles } from "./rooms.styles";
import RoomSheet from "./RoomSheet";
import { useAuth } from "@/React-Native/contexts/auth/AuthContext";
import { useTheme } from "@/React-Native/contexts/theme/ThemeContext";
import { useRoomsMutations } from "@/React-Native/hooks/rooms/useRoomsMutations";
import { useRoomsQuery } from "@/React-Native/hooks/rooms/useRoomsQuery";
import Skeleton from "../ui/Skeleton";

export default function RoomsScreen() {
  const { session } = useAuth();
  const homeId = session?.homeId ?? 0;
  const token = session?.token;

  const { data: rooms = [], isLoading, error } = useRoomsQuery({ homeId, token });
  const { turnRoomOnMutation, turnRoomOffMutation } = useRoomsMutations({ homeId, token });
  const [showRoomSheet, setShowRoomSheet] = useState(false);
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const stats = useMemo(() => {
    let total = 0;
    let on = 0;

    rooms.forEach((room) => {
      const roomDevices = room.devices ?? [];
      total += roomDevices.length;
      on += roomDevices.filter((d) => d.is_on).length;
    });

    return {
      total,
      on,
      off: total - on,
    };
  }, [rooms]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <View style={styles.frame}>
        <StatusBar barStyle="light-content" />
        <View style={styles.container}>
          <Header
            theme={theme}
            title="Rooms"
            kicker="Your Sanctuary"
            icon="bed-outline"
            onPressProfile={() => {}}
            onPressNotifications={() => {}}
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.content,
              { paddingBottom: insets.bottom + 150 },
            ]}
          >
            <HeroCard
              theme={theme}
              title="Every room, simplified."
              sub={
                'Preview devices by room. Tap "Open room" to\ncontrol everything.'
              }
              loading={isLoading}
              kpis={[
                { label: "Total devices", value: stats.total.toString() },
                { label: "Devices ON", value: stats.on.toString() },
                { label: "Devices OFF", value: stats.off.toString() },
                { label: "Quick tip", value: "Tap a room" },
              ]}
            />

            <RoomsSectionHeader
              theme={theme}
              title="Rooms"
              actionLabel="Add room"
              onPressAction={() => {
                setShowRoomSheet(true);
              }}
              style={{ marginTop: 14 }}
            />

            <View style={styles.cardList}>
              {isLoading ? (
                <View style={{ gap: 14 }}>
                   <Skeleton height={140} borderRadius={18} />
                   <Skeleton height={140} borderRadius={18} />
                </View>
              ) : (
              rooms.length === 0 ? (
                <EmptyRoomState 
                  theme={theme} 
                  onAddRoom={() => setShowRoomSheet(true)} 
                />
              ) : (
                rooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    theme={theme}
                    room={room}
                    onPressOpen={() => router.push(`/rooms/${room.id}`)}

                  />
                ))
              )
            )}
            </View>
          </ScrollView>
          <RoomSheet
            visible={showRoomSheet}
            onClose={() => setShowRoomSheet(false)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
