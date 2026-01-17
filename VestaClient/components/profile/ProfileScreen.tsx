import React, { useMemo, useState } from "react";
import { ScrollView, View, Text } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router } from "expo-router";


import BottomNav from "@/components/BottomNav";
import { profileStyles as styles } from "./ProfileScreen.styles";
import SettingsSection, { SettingsItem } from "@/components/profile/SettingsSection";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileSummaryCard from "@/components/profile/ProfileSummaryCard";
import DangerZoneActions from "@/components/profile/DangerZoneActions";
import { theme } from "@/constants/theme";
import ProfileSheet from "./ProfileSheet";
import { useAuth } from "@/contexts/auth/AuthContext";


export default function ProfileScreen() {
  const insets = useSafeAreaInsets();

  const [showModal,setShowModal] = useState(false)

  const {user,isLoading,logout} = useAuth()
  

  const homeSettings: SettingsItem[] = useMemo(
    () => [
      {
        title: "Edit Home",
        sub: "Name, default rooms, and basics",
        onPress: () => {router.push("/settings")},
      },
      {
        title: "Notifications",
        sub: "Expiry reminders and device alerts",
        onPress: () => {router.push("/settings");},
      },
      {
        title: "Theme",
        sub: "Dark (default). Switch to light",
        onPress: () => {router.push("/settings");},
      },
    ],
    []
  );

  const foodPrefs: SettingsItem[] = useMemo(
    () => [
      {
        title: "Diet",
        sub: "Name, default rooms, and basics",
        onPress: () => {},
      },
      {
        title: "Allergies",
        sub: "Expiry reminders and device alerts",
        onPress: () => {},
      },
      {
        title: "Disliked",
        sub: "Dark (default). Switch to light",
        onPress: () => {},
      },
    ],
    []
  );

  const support: SettingsItem[] = useMemo(
    () => [
      {
        title: "Privacy",
        sub: "Data, permissions, and controls",
        onPress: () => {},
      },
      {
        title: "About Vesta",
        sub: "Version, credits, and updates",
        onPress: () => {},
      },
    ],
    []
  );

  if (isLoading) return <Text>loading</Text>;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
      <View style={styles.screen}>
        <ProfileHeader
          theme={theme}
          title="Profile"
          onBack={() => router.back()}
        />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: 110 + insets.bottom },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <ProfileSummaryCard
            theme={theme}
            name={user?.name}
            homeLabel="Home:My home"
            onPressEdit={() => {setShowModal(true)}}
          />

          <SettingsSection
            theme={theme}
            title="Home Settings"
            items={homeSettings}
          />

          <SettingsSection
            theme={theme}
            title="Food preferences"
            items={foodPrefs}
          />

          <SettingsSection theme={theme} title="Support" items={support} />

          <View style={styles.dangerWrap}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Danger zone
            </Text>
            <DangerZoneActions
              theme={theme}
              onSignOut={() => {logout()}}
              onDeleteAccount={() => {}}
            />
          </View>
        </ScrollView>
        <ProfileSheet visible={showModal} onClose={()=>setShowModal(false)}/>

        <BottomNav theme={theme} />
      </View>
    </SafeAreaView>
  );
}
