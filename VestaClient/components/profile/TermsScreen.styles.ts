import { StyleSheet } from "react-native";

export const termsStyles = StyleSheet.create({
  safe: { flex: 1 },
  screen: {
    flex: 1,
    alignSelf: "center",
    width: "100%",
    maxWidth: 430,
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 12,
  },
  
  header: {
    fontSize: 15,
    fontWeight: "900",
    paddingHorizontal: 2,
    marginBottom: 12,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "900",
    paddingHorizontal: 2,
    marginBottom: 12,
  },
  
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
});
