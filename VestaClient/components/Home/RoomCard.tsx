import { Text, View } from "react-native";
import BulkActionButton from "../Room/BulkActionButton";
import Card from "../ui/Card";
import Pill from "../ui/Pill";
import { roomStyles as styles } from "./RoomCard.styles";
import { Room } from "@/features/rooms/rooms.types";
import { useTheme } from "@/contexts/theme/ThemeContext";

export default function RoomCard(props: {
  room:Room
  onPressAllOn: () => void;
  onPressAllOff: () => void;
  onPressCard: () => void;
}) {
  const { theme } = useTheme();
  const { room } = props;
  const devices = room.devices ?? [];
  const counts = devices.reduce(
    (acc, device) => {
      if (device.is_on)  acc.true++;
      else acc.false++;
      return acc;
    },
    { true: 0, false: 0 }
  );
  return (
    <Card theme={theme} style={{ padding: 16 }}>
      <View style={styles.roomTop}>
        <Text style={[styles.roomName, { color: theme.text }]}>
          {room.room_name.name}
        </Text>
        <Pill theme={theme} text={`${devices.length} devices`} />
      </View>

      <Text style={[styles.roomMeta, { color: theme.textMuted }]}>
        {counts.true} ON • {counts.false} OFF
      </Text>

      {devices.length !== 0 && (
        <View style={styles.roomActions}>
          <BulkActionButton
            theme={theme}
            label="All ON"
            onPress={props.onPressAllOn}
          />
          <BulkActionButton
            theme={theme}
            label="All OFF"
            onPress={props.onPressAllOff}
          />
        </View>
      )}
    </Card>
  );
}
