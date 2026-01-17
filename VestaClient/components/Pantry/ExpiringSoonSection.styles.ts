import { StyleSheet } from "react-native";

export const expiringSoonSectionStyles = StyleSheet.create({
  section: {
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "900",
  },
  card: {
    overflow: "hidden",
  },
  row: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  left: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: 14,
    fontWeight: "900",
  },
  meta: {
    fontSize: 12,
    fontWeight: "700",
  },
  badge: {
    alignSelf: "center",
  },
});
