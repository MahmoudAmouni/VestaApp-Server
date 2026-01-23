import { StyleSheet } from "react-native";

export const brandRowStyles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  mark: {
    width: 60,
    height: 60,
  },
  text: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
});
