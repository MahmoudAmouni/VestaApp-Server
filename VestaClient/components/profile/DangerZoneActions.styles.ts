import { StyleSheet } from "react-native";

export const dangerZoneStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
  },
  btn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  btnText: {
    fontSize: 13,
    fontWeight: "900",
  },
});
