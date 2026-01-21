import { StyleSheet } from "react-native";

export const chatMessageBubbleStyles = StyleSheet.create({
  row: {
    width: "100%",
    flexDirection: "row",
  },
  rowUser: {
    justifyContent: "flex-end",
  },
  rowAssistant: {
    justifyContent: "flex-start",
  },

  bubble: {
    maxWidth: "82%",
    minWidth: 200,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    gap: 6,
    margin: 10,
  },

  userBubble: {
    borderTopRightRadius: 8,
  },

  assistantBubble: {
    borderTopLeftRadius: 8,
  },

  name: {
    fontSize: 12,
    fontWeight: "900",
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 16,
  },
  recipeDataText: {
    fontFamily: "monospace",
    fontSize: 13,
    fontWeight: "900",
    textDecorationLine: "underline",
    letterSpacing: 0.5,
  },
});
