import { useTheme } from "@/contexts/theme/ThemeContext";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";

type ButtonVariant = "primary" | "secondary";

export default function Button(props: {
  variant: ButtonVariant;
  label: string;
  onPress: () => void;
  disabled?:boolean
  style?: ViewStyle; 
}) {
  const { theme } = useTheme();
  const { disabled } = props;

  const bg = props.variant === "primary" ? theme.primary : theme.surface2;
  const border = props.variant === "primary" ? theme.primary : theme.border;

  return (
    <Pressable
      onPress={props.onPress}
      style={({ pressed }) => [
        styles.btn,
        props.style,
        {
          backgroundColor: bg,
          borderColor: border,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
      accessibilityRole="button"
      disabled={disabled}
    >
      <Text style={[styles.btnText, { color: "#fff" }]}>{props.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontSize: 13,
    fontWeight: "900",
  },
});
