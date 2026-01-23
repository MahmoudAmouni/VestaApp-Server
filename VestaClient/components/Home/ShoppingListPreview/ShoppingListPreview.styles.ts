import { StyleSheet } from "react-native";

export const shoppingListPreviewStyles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  listContainer: {
    gap: 12,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  itemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
  },
  quantityText: {
    fontSize: 13,
    fontWeight: "500",
  },
  emptyText: {
    fontSize: 14,
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 10,
  },
  moreText: {
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 30, 
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
    marginTop: 4,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
