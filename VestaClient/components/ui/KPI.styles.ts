import { StyleSheet } from "react-native";

export const kpiStyles = StyleSheet.create({
  kpis: {
    marginTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  kpi: {
    width: "48%",
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
  },
  kpiLabel: {
    fontSize: 12,
    fontWeight: "700",
  },
  kpiValue: {
    marginTop: 6,
    fontSize: 26,
    fontWeight: "900",
  },
  kpiHint: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "600",
  },
});