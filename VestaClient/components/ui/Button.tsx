import { useTheme } from "@/contexts/theme/ThemeContext";
import { Pressable, StyleSheet, Text, ViewStyle, TextStyle, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ButtonVariant = "primary" | "secondary";

export default function Button(props: {
  variant?: ButtonVariant;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: keyof typeof Ionicons.glyphMap;
  flex?: boolean;
}) {
  const { theme } = useTheme();
  const { disabled, variant = "primary", icon, flex } = props;

  
  const bg = variant === "primary" ? theme.primary : theme.surface;
  const border = variant === "primary" ? theme.primary : theme.border;
  const textColor = variant === "primary" ? "#fff" : theme.textMuted;

  return (
    <Pressable
      onPress={props.onPress}
      style={({ pressed }) => [
        styles.btn,
        {
          backgroundColor: bg,
          borderColor: border,
          opacity: pressed || disabled ? 0.7 : 1,
          flex: flex ? 1 : undefined,
        },
        props.style,
      ]}
      accessibilityRole="button"
      disabled={disabled}
    >
      <View style={styles.content}>
        {icon && (
          <Ionicons
            name={icon}
            size={18}
            color={textColor}
            style={{ marginRight: 6 }}
          />
        )}
        <Text style={[styles.btnText, { color: textColor }, props.textStyle]}>{props.label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontSize: 14,
    fontWeight: "900",
  },
});
