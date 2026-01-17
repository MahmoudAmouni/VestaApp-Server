import type { Theme } from "@/type";
import { StyleSheet } from "react-native";

export function makePantryItemSheetStyles(theme: Theme, bottomInset: number) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.55)",
    },

    sheet: {
      backgroundColor: theme.surface,
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      paddingHorizontal: 14,
      paddingTop: 14,
      paddingBottom: bottomInset + 12,
      borderTopWidth: 1,
      borderColor: theme.border,
    },

    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 10,
    },

    title: {
      color: theme.text,
      fontSize: 16,
      fontWeight: "800",
    },

    pillBtn: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface2,
    },

    pillBtnText: {
      color: theme.textMuted,
      fontWeight: "800",
    },

    field: {
      marginTop: 12,
    },

    label: {
      color: theme.textMuted,
      marginBottom: 6,
      fontSize: 12,
      fontWeight: "800",
    },

    input: {
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface2,
      color: theme.text,
      fontWeight: "700",
    },

    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 10,
    },

    half: {
      flex: 1,
    },

    selectBox: {
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface2,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    selectText: {
      color: "white",
      fontWeight: "800",
    },

    selectPlaceholder: {
      color: theme.textMuted,
      fontWeight: "800",
    },

    actionsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 10,
      marginTop: 16,
    },

    actionBtn: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface2,
    },

    actionBtnPrimary: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.primary,
    },

    actionText: {
      color: theme.textMuted,
      fontWeight: "900",
    },

    actionTextPrimary: {
      color: theme.text,
      fontWeight: "900",
    },

    handle: {
      alignSelf: "center",
      width: 44,
      height: 5,
      borderRadius: 999,
      backgroundColor: theme.borderStrong,
      marginBottom: 10,
    },
  });
}
