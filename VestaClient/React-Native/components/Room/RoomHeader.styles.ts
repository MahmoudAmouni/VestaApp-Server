import { StyleSheet } from "react-native";

export const roomHeaderStyles = StyleSheet.create({
  wrap: {
    paddingTop: 10,
    paddingHorizontal: 14,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.2,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 14,
    borderWidth: 1,
  },
  addText: {
    fontSize: 13,
    fontWeight: "800",
  },
});
