import { StyleSheet } from "react-native";

export const themeToggleStyles = StyleSheet.create({
  wrap: {
    width: "100%",
  },
  track: {
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    padding: 4,
    flexDirection: "row",
    gap: 6,
  },
  segment: {
    flex: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 13,
    fontWeight: "900",
  },
});
