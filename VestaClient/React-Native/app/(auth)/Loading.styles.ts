import { StyleSheet } from "react-native";

export const loadingStyles = StyleSheet.create({
  screen: { flex: 1 },

  glowA: {
    position: "absolute",
    top: -140,
    left: -140,
    width: 380,
    height: 380,
    borderRadius: 380,
    opacity: 0.22,
    borderWidth: 1,
  },
  glowB: {
    position: "absolute",
    bottom: -160,
    right: -160,
    width: 420,
    height: 420,
    borderRadius: 420,
    opacity: 0.18,
    borderWidth: 1,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },

  card: {
    width: "100%",
    maxWidth: 430,
    alignSelf: "center",
    paddingTop: 22,
    paddingBottom: 18,
    alignItems: "center",
  },

  logo: {
    width: 72,
    height: 72,
    borderRadius: 28,
    borderWidth: 1,
    position: "relative",
    marginBottom: 10,
  },
  logoDot: {
    width: 14,
    height: 14,
    borderRadius: 999,
    position: "absolute",
    top: 14,
    right: 14,
  },
  logoDotGlow: {
    width: 34,
    height: 34,
    borderRadius: 999,
    position: "absolute",
    top: 4, 
    right: 4,
  },

  brand: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.2,
    marginBottom: 2,
  },

  title: {
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 14,
  },

  track: {
    width: "100%",
    borderRadius: 999,
    borderWidth: 1,
    height: 14,
    overflow: "hidden",
    padding: 2,
    marginBottom: 12,
  },

  bar: {
    height: "100%",
    borderRadius: 999,
  },

  subtitle: {
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 16,
    textAlign: "center",
  },
});
