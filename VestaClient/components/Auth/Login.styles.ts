import { StyleSheet } from "react-native";

export const loginStyles = StyleSheet.create({
  screen: { flex: 1 },

  glow: {
    position: "absolute",
    top: -140,
    right: -140,
    width: 360,
    height: 360,
    borderRadius: 360,
    opacity: 0.28,
    borderWidth: 1,
  },

  content: {
    paddingHorizontal: 16,
    flexGrow: 1,
  },

  card: {
    width: "100%",
    maxWidth: 430,
    alignSelf: "center",
    marginTop: 14,
  },

  h1: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  sub: {
    fontSize: 12.5,
    lineHeight: 18,
    marginBottom: 14,
  },

  form: {
    gap: 12,
  },

  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rememberLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkBox: {
    width: 16,
    height: 16,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  rememberText: {
    fontSize: 11,
    fontWeight: "800",
  },
  forgotText: {
    fontSize: 11,
    fontWeight: "900",
    textDecorationLine: "underline",
  },

  dividerText: {
    textAlign: "center",
    fontSize: 11,
    fontWeight: "800",
    marginTop: 2,
  },

  socialRow: {
    flexDirection: "row",
    gap: 12,
  },

  footer: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "800",
  },
  footerLink: {
    fontWeight: "900",
    textDecorationLine: "underline",
  },
});
