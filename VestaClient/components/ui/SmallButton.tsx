import { useTheme } from "@/contexts/theme/ThemeContext";
import { Pressable, ViewStyle, Text } from "react-native";
import { smallButtonStyles as styles } from "./SmallButton.styles";

export default function SmallButton(props: {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary"; // Optional, default to primary
  style?: ViewStyle;
}) {
  const { theme } = useTheme();
  const variant = props.variant ?? "primary";

  const bg = variant === "primary" ? theme.primary : theme.surface2;

  return (
    <Pressable
      onPress={props.onPress}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: bg,
          opacity: pressed ? 0.9 : 1,
        },
        props.style,
      ]}
      accessibilityRole="button"
    >
      <Text style={[styles.btnText, { color: "#fff" }]}>{props.label}</Text>
    </Pressable>
  );
}
