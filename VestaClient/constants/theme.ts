

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
  bg: "#ffffff",
  surface: "#f9f9fb",
  surface2: "#f0f0f4",
  text: "#11181C",
  textMuted: "rgba(17, 24, 28, 0.68)",
  border: "rgba(0,0,0,0.10)",
  borderStrong: "rgba(0,0,0,0.16)",
  primary: "#E7523C",
  navBg: "rgba(255, 255, 255, 0.82)",
  shadow1: "rgba(0,0,0,0.15)",
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
};

export const theme: Theme = darkTheme;
