import { StyleSheet } from "react-native";

export const roomsSectionHeaderStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "900",
  },
  actionBtn: {
    flexGrow: 0,
    height: 30,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
});
