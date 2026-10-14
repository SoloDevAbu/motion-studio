export const VIDEO_CONFIG = {
  width: 1080,
  height: 1920,
  fps: 30,
  safeMarginTop: 160,
  safeMarginBottom: 240,
  safeMarginX: 80,
} as const;

export const THEME_COLORS = {
  bg: "#09090B",
  surface: "rgba(24, 24, 27, 0.75)",
  surfaceBorder: "rgba(255, 255, 255, 0.12)",
  textPrimary: "#FAFAFA",
  textSecondary: "#A1A1AA",
  textMuted: "#71717A",
  accentBlue: "#3B82F6",
  accentCyan: "#06B6D4",
  accentPurple: "#A855F7",
  accentEmerald: "#10B981",
  accentAmber: "#F59E0B",
  accentRose: "#F43F5E",
} as const;

export const SPRING_PRESETS = {
  snappy: { damping: 14, mass: 0.6, stiffness: 120 },
  smooth: { damping: 20, mass: 1, stiffness: 90 },
  bouncy: { damping: 9, mass: 0.8, stiffness: 110 },
} as const;
