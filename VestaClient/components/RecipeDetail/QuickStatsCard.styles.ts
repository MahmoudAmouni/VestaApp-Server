import { StyleSheet } from "react-native";

export const quickStatsCardStyles = StyleSheet.create({
  card: { gap: 10 },
  title: { fontSize: 14, fontWeight: "900" },
  sub: { fontSize: 12, fontWeight: "700", lineHeight: 16 },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  stat: {
    width: "48%",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
  },
  statLabel: { fontSize: 11, fontWeight: "800" },
  statValue: { fontSize: 13, fontWeight: "900" },
});
