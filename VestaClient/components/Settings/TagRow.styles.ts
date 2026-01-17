import { StyleSheet } from "react-native";

export const tagRowStyles = StyleSheet.create({
  row: {
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    paddingLeft: 12,
    paddingRight: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  text: {
    flex: 1,
    fontSize: 13,
    fontWeight: "900",
  },
  trashBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
