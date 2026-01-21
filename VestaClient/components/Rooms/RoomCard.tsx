import React from "react";
import { Text, View } from "react-native";
import { Theme } from "@/type";



import { roomCardStyles as styles } from "./RoomCard.styles";
import Card from "../ui/Card";
import Pill from "../ui/Pill";
import Button from "../ui/Button";
import BulkActionButton from "@/components/Room/BulkActionButton";
import DeviceRow from "./DeviceRow";
import { Room } from "@/features/rooms/rooms.types";



export default function RoomCard(props: {
  theme: Theme;
  room: Room;
  onPressOpen: () => void;
  onPressAllOn: () => void;
  onPressAllOff: () => void;
}) {
  const { theme, room } = props;

  return (
    <Card theme={theme} padding={16} radius={18}>
      <View style={styles.head}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {room.room_name.name}
        </Text>

        <Pill
          theme={theme}
          text={`${room.devices?.length} device${
            room.devices?.length === 1 ? "" : "s"
          }`}
          paddingX={10}
          paddingY={5}
          style={{ backgroundColor: theme.surface2 }}
        />
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.preview}>
        {room.devices?.length === 0 ? (
          <View style={{ paddingVertical: 12, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: theme.textMuted, fontSize: 14 }}>No devices added yet</Text>
          </View>
        ) : (
          room.devices?.slice(0, 2).map((d) => (
            <DeviceRow key={d.id} theme={theme} device={d} roomId={room.id} />
          ))
        )}
      </View>

      <View style={styles.footer}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <BulkActionButton 
            theme={theme} 
            label="ON" 
            onPress={props.onPressAllOn}
            style={{ minWidth: 60 }}
          />
          <BulkActionButton 
            theme={theme} 
            label="OFF" 
            onPress={props.onPressAllOff}
            style={{ minWidth: 60 }}
          />
        </View>

        <Button
          variant="secondary"
          label="Open"
          onPress={props.onPressOpen}
          style={styles.openBtn}
        />
      </View>
    </Card>
  );
}
