import { StyleSheet } from "react-native";

export const shoppingStyles = StyleSheet.create({
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
    paddingTop: 12,
    gap: 14,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    paddingHorizontal: 2,
  },
  clearWrap: {
    marginTop: 2,
  },
});
