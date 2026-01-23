import { StyleSheet } from "react-native";

export const profileSummaryStyles = StyleSheet.create({
  card: {
    gap: 12,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: "900",
  },
  sub: {
    fontSize: 12,
    fontWeight: "700",
  },
  editBtn: {
    width: "100%",
    borderRadius: 14,
    paddingVertical: 12,
  },
});
