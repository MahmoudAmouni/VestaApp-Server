import { StyleSheet } from "react-native";

export const roomCardStyles = StyleSheet.create({
  head: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "900",
    flex: 1,
  },
  preview: {
    marginTop: 12,
    gap: 10,
  },
  divider: {
    marginTop: 12,
    height: StyleSheet.hairlineWidth,
    opacity: 0.9,
  },
  footer: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 12,
  },
  footerSolo: {
    marginTop: 12,
    alignItems: "center",
  },
  hint: {
    fontSize: 12,
    fontWeight: "900",
  },
  openBtn: {
    flexGrow: 0,
    minWidth: 128,
    borderRadius: 12,
  },
  openBtnSolo: {
    minWidth: 160,
    borderRadius: 12,
  },
});
