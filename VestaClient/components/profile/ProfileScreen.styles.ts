import { StyleSheet } from "react-native";

export const profileStyles = StyleSheet.create({
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: "900",
    paddingHorizontal: 2,
  },
  dangerWrap: {
    gap: 10,
    marginTop: 4,
  },
});
