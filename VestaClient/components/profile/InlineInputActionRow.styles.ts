import { StyleSheet } from "react-native";

export const inlineInputActionRowStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  inputWrap: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  input: {
    fontSize: 13,
    fontWeight: "800",
  },
  actionBtn: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
});
