import { StyleSheet } from "react-native";

export const settingsNavRowStyles = StyleSheet.create({
  row: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  left: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 13,
    fontWeight: "900",
  },
  sub: {
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 14,
  },
});
