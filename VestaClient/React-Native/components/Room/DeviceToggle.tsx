import { Theme } from "@/type";
import { Pressable, Text, View } from "react-native";
import { roomDetailsStyles as styles } from "./RoomDetailsScreen.styles";


export function DeviceToggle(p: { on: boolean;theme:Theme; onPress?: () => void }) {
    const {on:isOn,theme} = p;
    return (
      <Pressable
        onPress={p.onPress}
        style={({ pressed }) => [
          styles.toggle,
          {
            backgroundColor: isOn ? theme.primary : theme.bg,
            borderColor: isOn ? "transparent" : theme.border,
            opacity: pressed ? 0.9 : 1,
          },
        ]}
        accessibilityRole="switch"
        accessibilityState={{ checked: isOn }}
        accessibilityLabel={isOn ? "Device on" : "Device off"}
      >
        <View
          style={[
            styles.toggleDot,
            {
              backgroundColor: isOn ? "rgba(255,255,255,0.92)" : theme.bg,
              borderColor: isOn ? "transparent" : theme.border,
            },
          ]}
        />
        <Text
          style={[
            styles.toggleText,
            { color: isOn ? "#FFFFFF" : theme.textMuted },
          ]}
        >
          {isOn ? "ON" : "OFF"}
        </Text>
      </Pressable>
    );
  }