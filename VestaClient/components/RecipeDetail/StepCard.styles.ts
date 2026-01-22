import { StyleSheet } from "react-native";

export const stepCardStyles = StyleSheet.create({
  card: { gap: 10 },
  headRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  leftHead: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  numBox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  num: {
    fontSize: 12,
    fontWeight: "900",
  },
  title: {
    fontSize: 13,
    fontWeight: "900",
    flexShrink: 1,
  },
  body: {
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 16,
  },
});
