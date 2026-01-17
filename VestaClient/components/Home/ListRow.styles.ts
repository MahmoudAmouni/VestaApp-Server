import { StyleSheet } from "react-native";

export const listRowStyles = StyleSheet.create({
  listRow: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    justifyContent: "space-between",
  },
  listTitle: {
    fontSize: 14,
    fontWeight: "900",
  },
  listSub: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },

  tag: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "900",
  },
});