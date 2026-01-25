import { StyleSheet } from "react-native";

export const shoppingItemRowStyles = StyleSheet.create({
  row: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  check: {
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 12,
  },
  textBlock: { flex: 1, gap: 2 },
  name: { fontSize: 13, fontWeight: "900" },
  meta: { fontSize: 11, fontWeight: "700" },
  statusPill: { alignSelf: "center" },
});
