import { StyleSheet } from "react-native";

export const chatComposerStyles = StyleSheet.create({
  wrap: {    
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    borderTopWidth: 1,
    top:-80,
  },
  inputWrap: {
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    paddingLeft: 12,
    paddingRight: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
