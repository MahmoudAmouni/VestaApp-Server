import { StyleSheet } from "react-native";

export const deviceRowStyles = StyleSheet.create({
  row: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  main: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontWeight: "900",
  },
  sub: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBtn: {
    width: 30,
    height: 30,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
