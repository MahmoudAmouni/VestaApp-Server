import { StyleSheet } from "react-native";

export const quickActionTileStyles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    minHeight: 78,
    justifyContent: "space-between",

    flexBasis: "48%",
    flexGrow: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
  },
  value: {
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: -0.2,
  },
});
