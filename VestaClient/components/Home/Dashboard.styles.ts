import { StyleSheet } from "react-native";

export const indexStyles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  phone: {
    flex: 1,
    alignSelf: "center",
    width: "100%",
    maxWidth: 430,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  sectionGap: {
    marginTop: 10,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
  },
  aiTitle: {
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 10,
  },
  aiInputRow: {
    borderWidth: 1,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  aiInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 13,
    fontWeight: "600",
  },
  aiSendBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    marginRight: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  aiSendText: {
    fontSize: 16,
    fontWeight: "900",
  },
});
