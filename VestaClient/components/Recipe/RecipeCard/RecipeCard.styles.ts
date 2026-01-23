import { StyleSheet } from "react-native";

export const recipeCardStyles = StyleSheet.create({
  card: {
    width: "100%",
  },
  topRow: {
    flexDirection: "row",
    gap: 12,
  },
  left: {
    flex: 1,
    gap: 6,
  },
  right: {
    alignItems: "flex-end",
    gap: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "900",
  },
  sub: {
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 16,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  tagPill: {
    alignSelf: "flex-start",
  },
  badgePill: {
    alignSelf: "flex-end",
  },
  starBtn: {
    width: 30,
    height: 30,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  cookBtn: {
    paddingVertical: 8,
  },
  askAiBtn: {
    paddingVertical: 8,
  },
});
