import { StyleSheet } from "react-native";

export const headerStyles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
  },
  textBlock: {
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: -0.2,
  },
  kicker: {
    fontSize: 12,
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
