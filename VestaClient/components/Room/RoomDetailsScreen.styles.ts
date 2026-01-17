import { StyleSheet } from "react-native";

export const roomDetailsStyles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  screen: {
    flex: 1,
    alignSelf: "center",
    width: "100%",
    maxWidth: 430,
  },
  scroll: {
    paddingHorizontal: 14,
    paddingTop: 12,
    gap: 14,
  },
  tiles: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  bulkRow: {
    marginTop: 10,
    flexDirection: "row",
    gap: 10,
  },
  bulkBtn: {
    flex: 1,
    height: 38,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bulkText: {
    fontSize: 12,
    fontWeight: "900",
  },
  sectionHead: {
    marginTop: 0,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.2,
  },
  list: {
    gap: 10,
  },

  deviceRow: {
    borderWidth: 1,
    borderRadius: 14,
    height: 56,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  deviceName: {
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: -0.2,
  },
  deviceRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  toggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 999,
    borderWidth: 1,
    height: 26,
    paddingHorizontal: 10,
    minWidth: 70,
    justifyContent: "center",
  },
  toggleDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  toggleText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.3,
  },
  deviceIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
