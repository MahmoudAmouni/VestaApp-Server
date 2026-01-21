import React, { useState } from "react";
import { SafeAreaView, ScrollView, StatusBar, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BottomNav from "@/components/ui/BottomNav";
import RoomCard from "@/components/Rooms/RoomCard";
import RoomsSectionHeader from "@/components/Rooms/RoomSectionHeader";
import HeroCard from "@/components/ui/HeroCard";

import Header from "@/components/ui/Header";
import { useRouter } from "expo-router";
import { roomsStyles as styles } from "./rooms.styles";
import RoomSheet from "./RoomSheet";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useTheme } from "@/contexts/theme/ThemeContext";
import { useRoomsQuery } from "@/hooks/rooms/useRoomsQuery";

import Skeleton from "@/components/ui/Skeleton";



export default function RoomsScreen() {
  const { session } = useAuth();
  const homeId = session?.homeId ?? 0;
  const token = session?.token;

  const { data: rooms = [], isLoading, error } = useRoomsQuery({ homeId, token });
  const [showRoomSheet, setShowRoomSheet] = useState(false);
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
              sub={'Preview devices by room. Tap "Open room" to\ncontrol everything.'}
              loading={isLoading}
              kpis={[
                { label: "Total devices", value: "7", smallValue: true },
                { label: "Devices ON", value: "3", smallValue: true },
                { label: "Devices OFF", value: "4", smallValue: true },
                { label: "Quick tip", value: "Tap a room", smallValue: true },
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

            <View>
              {isLoading ? (
                <View style={{ gap: 14 }}>
                   <Skeleton height={140} borderRadius={18} />
                   <Skeleton height={140} borderRadius={18} />
                </View>
              ) : (
                rooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    theme={theme}
                    room={room}
                    onPressOpen={() => router.push(`/rooms/${room.id}`)}
                  />
                ))
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
