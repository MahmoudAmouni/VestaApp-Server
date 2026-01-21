import BottomNav from "@/components/ui/BottomNav";
import Header from "@/components/ui/Header";
import HeroCard from "@/components/ui/HeroCard";
import RoomCard from "@/components/Home/RoomCard";

import SectionHeader from "@/components/Home/SectionHeader";

import { useRoomsQuery } from "@/hooks/rooms/useRoomsQuery";
import { usePantryQuery } from "@/hooks/pantry/usePantryQuery";
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
import { useTheme } from "@/contexts/theme/ThemeContext";

type NavKey = "Home" | "Rooms" | "Pantry" | "Recipes" | "AI";

export default function DashboardScreen() {
  const { theme } = useTheme();
  
  const [activeTab, setActiveTab] = useState<NavKey>("Home");
  const { session } = useAuth();
  const homeId = session?.homeId ?? 0;
  const token = session?.token;

  const { data: pantryItems = [], isLoading } = usePantryQuery({ homeId, token });
  const { data: rooms = [], isLoading: isGettingRooms } = useRoomsQuery({ homeId, token });
  const isWorking = isLoading || isGettingRooms;

  if (isWorking) return;
  const expiringSoon = getExpiringSoon(pantryItems);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.phone, { backgroundColor: theme.surface }]}>
        <Header
          theme={theme}
          kicker="Welcome Home"
          title="Dashboard"
          icon="grid-outline"
          onPressNotifications={() => {}}
        />

        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 150 }]}
          showsVerticalScrollIndicator={false}
        >
          <HeroCard
            theme={theme}
            kicker="Today’s vibe"
            title="Calm & ready."
            sub="A quick snapshot of your space — lights, pantry, and what’s coming up."
            kpis={[
              { label: "Devices ON", value: "3" },
              { label: "Offline", value: "0" },
              { label: "Expiring soon", value: "2" },
              { label: "Saved Recipes", value: "12" },
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

                <ExpiringSoonSection items={expiringSoon} />
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
