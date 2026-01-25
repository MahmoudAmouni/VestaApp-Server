import { StyleSheet } from "react-native";

export const savedRecipesSearchBarStyles = StyleSheet.create({
  wrap: {
    height: 44,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
  },
});
