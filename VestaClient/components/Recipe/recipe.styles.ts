import { StyleSheet } from "react-native";

export const recipesScreenStyles = StyleSheet.create({
  safe: { flex: 1 },
  screen: {
    flex: 1,
    alignSelf: "center",
    width: "100%",
    maxWidth: 430,
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 14,
  },

  heroBtn: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
});
