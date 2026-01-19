import BottomNav from "@/components/ui/BottomNav";
import Card from "@/components/ui/Card";
import Header from "@/components/ui/Header";
import HeroCard from "@/components/ui/HeroCard";
import RoomCard from "@/components/Home/RoomCard";

import SectionHeader from "@/components/Home/SectionHeader";
import { theme } from "@/constants/theme";
import { useRooms } from "@/features/rooms/useRooms";
import { usePantry } from "@/features/pantry/usePantry";
import { getExpiringSoon } from "@/utils/dateHelpers";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
} from "react-native";
import ExpiringSoonSection from "../Pantry/ExpiringSoonSection";
import { indexStyles as styles } from "./Dashboard.styles";
import { useAuth } from "@/contexts/auth/AuthContext";

type NavKey = "Home" | "Rooms" | "Pantry" | "Recipes" | "AI";

export default function DashboardScreen() {
  
  const [activeTab, setActiveTab] = useState<NavKey>("Home");
  const { session } = useAuth();
  const homeId = session?.homeId ?? 0;
  const token = session?.token;

  const { pantryItems, isLoading } = usePantry(homeId, token);
  const { rooms, isLoading: isGettingRooms } = useRooms(homeId, token);
  const isWorking = isLoading || isGettingRooms;

  if (isWorking) return;
  const expiringSoon = getExpiringSoon(pantryItems);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.phone, { backgroundColor: theme.surface }]}>
        <Header
          theme={theme}
          kicker="Home Pulse"
          title="My Home"
          onPressNotifications={() => {}}
        />

        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 90 }]}
          showsVerticalScrollIndicator={false}
        >
          <HeroCard
            theme={theme}
            kicker="Today’s vibe"
            title="Calm & ready."
            sub="A quick snapshot of your space — lights, pantry, and what’s coming up."
            kpis={[
              { label: "Devices ON", value: "3", hint: "Kitchen + Living" },
              { label: "Offline", value: "0", hint: "All online" },
              { label: "Expiring soon", value: "2", hint: "Next 48hr" },
              { label: "Saved Recipes", value: "12", hint: "Start Cooking!" },
            ]}
          />

          <SectionHeader
            theme={theme}
            title="Rooms"
            actionLabel="Manage"
            onPressAction={() => setActiveTab("Rooms")}
          />

          <View style={styles.sectionGap}>
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onPressAllOn={() => {}}
                onPressAllOff={() => {}}
                onPressCard={() => {}}
              />
            ))}
          </View>

          
            <>
              <SectionHeader
                theme={theme}
                title="Expiring Soon"
                actionLabel="Open Pantry"
                onPressAction={() => setActiveTab("Pantry")}
              />

              <Card
                theme={theme}
                style={{ paddingVertical: 0, overflow: "hidden" }}
              >
                <ExpiringSoonSection items={expiringSoon} />
              </Card>
            </>
          <View style={{ height: 14 }} />
          

          <View style={{ height: 18 }} />
        </ScrollView>

        <BottomNav
          theme={theme}
          active={activeTab}
          onChange={(k) => setActiveTab(k)}
        />
      </View>
    </SafeAreaView>
  );
}
