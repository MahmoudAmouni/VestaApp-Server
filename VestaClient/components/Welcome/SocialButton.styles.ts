import { StyleSheet } from "react-native";

export const socialButtonStyles = StyleSheet.create({
  btn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  text: {
    fontSize: 13,
    fontWeight: "900",
  },
});
