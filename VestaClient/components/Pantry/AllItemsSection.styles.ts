import { StyleSheet } from "react-native";

export const allItemsSectionStyles = StyleSheet.create({
  section: {
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "900",
  },
  addBtn: {
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  list: {
    gap: 12,
  },
});
