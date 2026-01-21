import BottomNav from "@/components/ui/BottomNav";
import Header from "@/components/ui/Header";
import HeroCard from "@/components/ui/HeroCard";
import RoomCard from "@/components/Home/RoomCard";
import EmptyRoomState from "@/components/Rooms/EmptyRoomState";

import SectionHeader from "@/components/Home/SectionHeader";

import { useRoomsQuery } from "@/hooks/rooms/useRoomsQuery";
import { usePantryQuery } from "@/hooks/pantry/usePantryQuery";
import { getExpiringSoon } from "@/utils/dateHelpers";
import RoomSheet from "@/components/Rooms/RoomSheet";
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
import Skeleton from "../ui/Skeleton";

type NavKey = "Home" | "Rooms" | "Pantry" | "Recipes" | "AI";

export default function DashboardScreen() {
  const { theme } = useTheme();
  
  const [activeTab, setActiveTab] = useState<NavKey>("Home");
  const [showRoomSheet, setShowRoomSheet] = useState(false);
  const { session } = useAuth();
  const homeId = session?.homeId ?? 0;
  const token = session?.token;

  const { data: pantryItems = [], isLoading } = usePantryQuery({ homeId, token });
  const { data: rooms = [], isLoading: isGettingRooms } = useRoomsQuery({ homeId, token });
  const isWorking = isLoading || isGettingRooms;
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
            title="Calm & ready."
            sub="A quick snapshot of your space — lights, pantry, and what’s coming up."
            loading={isWorking}
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
            {isWorking ? (
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
                    room={room}
                    onPressAllOn={() => {}}
                    onPressAllOff={() => {}}
                    onPressCard={() => {}}
                  />
                ))
              )
            )}
          </View>

          
            <>
              <SectionHeader
                theme={theme}
                title="Expiring Soon"
                actionLabel="Open Pantry"
                onPressAction={() => setActiveTab("Pantry")}
              />

                {isWorking ? (
                  <Skeleton height={100} borderRadius={12} />
                ) : (
                  <ExpiringSoonSection items={expiringSoon} />
                )}
            </>
          <View style={{ height: 14 }} />
          


          <View style={{ height: 18 }} />
        </ScrollView>
        <RoomSheet
          visible={showRoomSheet}
          onClose={() => setShowRoomSheet(false)}
        />
      </View>
    </SafeAreaView>
  );
}
