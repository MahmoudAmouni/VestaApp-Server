import React from "react";
import { Text, View } from "react-native";
import { Theme } from "@/type";


import { roomCardStyles as styles } from "./RoomCard.styles";
import Card from "../ui/Card";
import Pill from "../ui/Pill";
import Button from "../ui/Button";
import DeviceRow from "./DeviceRow";
import { Room } from "@/features/rooms/rooms.types";



export default function RoomCard(props: {
  theme: Theme;
  room: Room;
  onPressOpen: () => void;
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
        {room.devices?.slice(0, 2).map((d) => (
          <DeviceRow key={d.id} theme={theme} device={d} roomId={room.id} />
        ))}
      </View>

      {room.devices?.length > 2 ? (
        <View style={styles.footer}>
          <Text style={[styles.hint, { color: theme.textMuted }]}>
            {`+ ${room.devices?.length - 2} more devices`}
          </Text>

          <Button
            variant="secondary"
            label="Open room"
            onPress={props.onPressOpen}
            style={styles.openBtn}
          />
        </View>
      ) : (
        <View style={styles.footerSolo}>
          <Text style={[styles.hint, { color: theme.textMuted }]}>
            
          </Text>
          <Button
            variant="secondary"
            label="Open room"
            onPress={props.onPressOpen}
            style={styles.openBtnSolo}
          />
        </View>
      )}
    </Card>
  );
}
