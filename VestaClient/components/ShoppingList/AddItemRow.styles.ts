import { StyleSheet } from "react-native";

export const addItemRowStyles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  inputWrap: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  input: { fontSize: 13, fontWeight: "800" },
  saveBtn: { height: 40, paddingHorizontal: 16, borderRadius: 12 },
});
