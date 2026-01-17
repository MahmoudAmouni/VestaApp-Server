import { StyleSheet } from "react-native";

export const roomActionsStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 10,
  },
  btn: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontSize: 13,
    fontWeight: "900",
  },
  btnContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
