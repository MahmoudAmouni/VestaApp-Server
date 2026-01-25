import { StyleSheet } from "react-native";

export const roomsStyles = StyleSheet.create({
  safe: { flex: 1 },

  frame: {
    flex: 1,
    alignItems: "center",
  },
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 430,
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 24,
  },

  topBar: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },
  topLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  topActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.2,
  },
  kicker: {
    fontSize: 13,
    fontWeight: "600",
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },

  filterRow: {
    paddingVertical: 8,
    paddingRight: 6,
    gap: 8,
  },

  sectionHeader: {
    marginTop: 4,
    marginBottom: -2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
  },

  cardList: {
    gap: 12,
  },
  rowTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: -0.1,
  },
  itemSub: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "600",
  },
  actionsRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 10,
  },
  actionBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
});
