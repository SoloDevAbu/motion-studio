import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SPRING_PRESETS, THEME_COLORS } from "../styles/theme.js";

export type StatCounterProps = {
  readonly value: number;
  readonly prefix?: string;
  readonly suffix?: string;
  readonly label: string;
  readonly color?: string;
  readonly delayFrames?: number;
  readonly decimals?: number;
  readonly style?: React.CSSProperties;
};

export const StatCounter: React.FC<StatCounterProps> = ({
  value,
  prefix = "",
  suffix = "",
  label,
  color = THEME_COLORS.accentEmerald,
  delayFrames = 0,
  decimals = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delayFrames,
    fps,
    config: SPRING_PRESETS.bouncy,
  });

  const countProgress = spring({
    frame: frame - delayFrames,
    fps,
    config: SPRING_PRESETS.smooth,
  });

  const clampedEntrance = Math.max(0, Math.min(1, entrance));
  const clampedProgress = Math.max(0, Math.min(1, countProgress));

  const currentValue = (value * clampedProgress).toFixed(decimals);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 56px",
        borderRadius: "36px",
        backgroundColor: THEME_COLORS.surface,
        backdropFilter: "blur(24px)",
        border: `2px solid ${color}66`,
        boxShadow: `0 0 60px ${color}33`,
        opacity: clampedEntrance,
        scale: `${0.8 + 0.2 * clampedEntrance}`,
        transformOrigin: "center center",
        textAlign: "center",
        minWidth: "480px",
        maxWidth: "920px",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "center",
          gap: "8px",
          color,
          fontSize: "128px",
          fontWeight: 800,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          textShadow: `0 0 40px ${color}88`,
        }}
      >
        {prefix ? (
          <span style={{ fontSize: "72px", fontWeight: 700, opacity: 0.9 }}>
            {prefix}
          </span>
        ) : null}
        <span>{currentValue}</span>
        {suffix ? (
          <span style={{ fontSize: "72px", fontWeight: 700, opacity: 0.9 }}>
            {suffix}
          </span>
        ) : null}
      </div>

      <div
        style={{
          marginTop: "20px",
          fontSize: "36px",
          fontWeight: 600,
          color: THEME_COLORS.textSecondary,
          letterSpacing: "-0.01em",
          lineHeight: 1.3,
          maxWidth: "800px",
        }}
      >
        {label}
      </div>
    </div>
  );
};
