import { StyleSheet } from "react-native";

export const heroCardStyles = StyleSheet.create({
  heroCard: {
    borderRadius: 18,
  },
  heroTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  heroKicker: {
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  heroTitle: {
    marginTop: 2,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.2,
  },
  heroSub: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 16,
  },

  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
  },
  heroDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    shadowOpacity: 1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  heroBadgeText: {
    fontWeight: "900",
    fontSize: 13,
  },
  kpis: {
    marginTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
});