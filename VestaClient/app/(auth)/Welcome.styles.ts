import { StyleSheet } from "react-native";

export const welcomeStyles = StyleSheet.create({
  screen: { flex: 1 },
  glowA: {
    position: "absolute",
    top: -120,
    left: -120,
    width: 260,
    height: 260,
    borderRadius: 260,
    opacity: 0.35,
    borderWidth: 1,
  },
  glowB: {
    position: "absolute",
    bottom: -140,
    right: -140,
    width: 320,
    height: 320,
    borderRadius: 320,
    opacity: 0.25,
    borderWidth: 1,
  },

  content: {
    alignItems: "center",
    paddingHorizontal: 16,
    flexGrow: 1,
  },

  mainCard: {
    width: "100%",
    maxWidth: 430,
  },

  h1: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  p: {
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 14,
  },

  featureList: {
    gap: 10,
    marginBottom: 14,
  },

  ctaRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 2,
    marginBottom: 10,
  },

  dividerText: {
    textAlign: "center",
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 10,
  },

  socialRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },

  legal: {
    fontSize: 10.5,
    lineHeight: 16,
    fontWeight: "700",
  },
  legalLink: {
    fontWeight: "900",
    textDecorationLine: "underline",
  },
});
