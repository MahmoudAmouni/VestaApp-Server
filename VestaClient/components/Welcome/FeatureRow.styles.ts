import { Platform, StyleSheet } from "react-native";

export const featureRowStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 2,
  },
  sub: {
    fontSize: 11,
    fontWeight: Platform.select({ ios: "600", android: "700", default: "700" }),
  },
});
