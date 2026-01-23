

import { Theme } from '@/type';
import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});


export const lightTheme: Theme = {
  bg: "#F5F7FA", // Premium Cool Grey Background
  surface: "#FFFFFF", // Pure White Cards
  surface2: "#EDF2F7", // Very Light Cool Grey for secondary elements
  text: "#1A202C", // Deep Navy-Black for high contrast & readability
  textMuted: "#64748B", // Cool Slate Grey for subtle text
  border: "#E2E8F0", // Subtle Cool Grey Border
  borderStrong: "#CBD5E1", // Slightly darker border for distinction
  primary: "#E7523C", // Brand Primary (Unchanged)
  navBg: "rgba(255, 255, 255, 0.90)", // Frosted glass effect
  shadow1: "rgba(148, 163, 184, 0.15)", // Colored shadow (slate blueish) for depth
  statusError: "#EF4444",
};

export const darkTheme: Theme = {
  bg: "#15151B",
  surface: "#15151b",
  surface2: "#1B1B23",
  text: "#f3f3f6",
  textMuted: "rgba(243, 243, 246, 0.68)",
  border: "rgba(255,255,255,0.10)",
  borderStrong: "rgba(255,255,255,0.16)",
  primary: "#E7523C",
  navBg: "#0F0F12",
  shadow1: "rgba(0,0,0,0.35)",
  statusError: "#EF4444",
};

export const theme: Theme = darkTheme;
