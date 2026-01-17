import { StyleSheet } from "react-native";

export const ingredientRowStyles = StyleSheet.create({
  row: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  name: {
    flex: 1,
    fontSize: 12,
    fontWeight: "900",
  },
});
