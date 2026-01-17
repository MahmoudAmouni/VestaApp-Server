import { StyleSheet } from "react-native";

export const roomsHeroStatStyles = StyleSheet.create({
  card: {
    flexGrow: 1,
    flexBasis: "48%",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 64,
    justifyContent: "space-between",
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
  },
  value: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.2,
  },
  valueTip: {
    fontSize: 14,
  },
});