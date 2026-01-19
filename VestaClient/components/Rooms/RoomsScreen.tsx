import React, { useState } from "react";
import { SafeAreaView, ScrollView, StatusBar, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Theme } from "@/type";

import BottomNav from "@/components/ui/BottomNav";
import RoomCard from "@/components/Rooms/RoomCard";
import RoomsSectionHeader from "@/components/Rooms/RoomSectionHeader";
import RoomsHero from "@/components/Rooms/RoomsHero";

import Header from "@/components/ui/Header";
import { useRouter } from "expo-router";
import { roomsStyles as styles } from "./rooms.styles";
import RoomSheet from "./RoomSheet";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useTheme } from "@/contexts/theme/ThemeContext";
import { useRoomsQuery } from "@/hooks/rooms/useRoomsQuery";

export default function RoomsScreen() {
  const { session } = useAuth();
  const homeId = session?.homeId ?? 0;
  const token = session?.token;

  const { data: rooms = [], isLoading, error } = useRoomsQuery({ homeId, token });
  const [showRoomSheet, setShowRoomSheet] = useState(false);
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  if (isLoading) return <Text>Loading</Text>;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <View style={styles.frame}>
        <StatusBar barStyle="light-content" />
        <View style={styles.container}>
          <Header
            theme={theme}
            title="Vesta"
            kicker="Rooms"
            onPressProfile={() => {}}
            onPressNotifications={() => {}}
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.content,
              { paddingBottom: insets.bottom + 96 },
            ]}
          >
            <RoomsHero
              theme={theme}
              title="Every room, simplified."
              sub={
                'Preview devices by room. Tap "Open room" to\ncontrol everything.'
              }
              stats={[
                { label: "Total devices", value: "7" },
                { label: "Devices ON", value: "3" },
                { label: "Devices OFF", value: "4" },
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

            <View>
              {rooms.map((room) => (
                <RoomCard
                  key={room.id}
                  theme={theme}
                  room={room}
                  onPressOpen={() => router.push(`/rooms/${room.id}`)}
                />
              ))}
            </View>
          </ScrollView>
          <RoomSheet
            visible={showRoomSheet}
            onClose={() => setShowRoomSheet(false)}
          />

          <View style={{ paddingBottom: insets.bottom }}>
            <BottomNav theme={theme} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
