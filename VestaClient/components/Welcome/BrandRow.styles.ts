import { StyleSheet } from "react-native";

export const brandRowStyles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  mark: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
});
