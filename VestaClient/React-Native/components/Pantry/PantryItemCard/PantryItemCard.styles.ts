import { StyleSheet } from "react-native";

export const pantryItemCardStyles = StyleSheet.create({
  card: {
    gap: 10,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  left: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: 14,
    fontWeight: "900",
  },
  meta: {
    fontSize: 12,
    fontWeight: "700",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
