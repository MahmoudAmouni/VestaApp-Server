import { StyleSheet } from "react-native";

export const roomStyles = StyleSheet.create({
  roomTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  roomName: {
    fontSize: 16,
    fontWeight: "900",
  },
  roomMeta: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "700",
  },
  roomActions: {
    marginTop: 12,
    flexDirection: "row",
    gap: 10,
  },
});