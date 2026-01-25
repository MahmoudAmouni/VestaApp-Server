import { Platform, StyleSheet } from "react-native";

export const bottomstyles = StyleSheet.create({
  bottomNav: {
    borderTopWidth: 1,
    paddingTop: 4,
    paddingBottom: Platform.OS === "ios" ? 22 : 8,
    paddingHorizontal: 8,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  navItem: {
    alignItems: "center",
    gap: 6,
    minWidth: 56,
  },
  navIconWrap: {
    width: 60,
    height: 50,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  navText: {
    fontSize: 11,
    fontWeight: "800",
  },
});