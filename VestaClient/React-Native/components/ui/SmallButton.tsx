import { useTheme } from "@/contexts/theme/ThemeContext";
import { Pressable, ViewStyle, Text } from "react-native";
import { smallButtonStyles as styles } from "./SmallButton.styles";

export default function SmallButton(props: {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "text"; 
  style?: ViewStyle;
}) {
  const { theme } = useTheme();
  const variant = props.variant ?? "primary";
  const isText = variant === "text";

  const bg = isText ? "transparent" : (variant === "primary" ? theme.primary : theme.surface2);
  const textColor = isText ? theme.primary : "#fff";

  return (
    <Pressable
      onPress={props.onPress}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: bg,
          opacity: pressed ? 0.9 : 1,
          paddingHorizontal: isText ? 0 : 14,
        },
        props.style,
      ]}
      accessibilityRole="button"
    >
      <Text style={[styles.btnText, { color: textColor }]}>{props.label}</Text>
    </Pressable>
  );
}
