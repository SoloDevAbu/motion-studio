import React from "react";
import { Icon } from "@iconify/react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SPRING_PRESETS, THEME_COLORS } from "../styles/theme.js";

export type FlowNodeProps = {
  readonly id?: string;
  readonly label: string;
  readonly icon: string;
  readonly color?: string;
  readonly delayFrames?: number;
  readonly subtitle?: string;
  readonly style?: React.CSSProperties;
};

export const FlowNode: React.FC<FlowNodeProps> = ({
  label,
  icon,
  color = THEME_COLORS.accentBlue,
  delayFrames = 0,
  subtitle,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delayFrames,
    fps,
    config: SPRING_PRESETS.snappy,
  });

  const clampedEntrance = Math.max(0, Math.min(1, entrance));
  const pulseOpacity = 0.6 + 0.4 * Math.sin((frame - delayFrames) * 0.1);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "28px",
        padding: "28px 40px",
        borderRadius: "28px",
        backgroundColor: THEME_COLORS.surface,
        backdropFilter: "blur(20px)",
        border: `2px solid ${color}`,
        boxShadow: `0 0 32px ${color}${Math.round(pulseOpacity * 60).toString(16).padStart(2, "0")}`,
        opacity: clampedEntrance,
        scale: `${0.85 + 0.15 * clampedEntrance}`,
        transformOrigin: "center center",
        width: "fit-content",
        maxWidth: "920px",
        color: THEME_COLORS.textPrimary,
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "76px",
          height: "76px",
          borderRadius: "20px",
          backgroundColor: `${color}22`,
          border: `1.5px solid ${color}66`,
          color,
          flexShrink: 0,
        }}
      >
        <Icon icon={icon} width="44" height="44" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        <span
          style={{
            fontSize: "36px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
          }}
        >
          {label}
        </span>
        {subtitle ? (
          <span
            style={{
              fontSize: "24px",
              fontWeight: 500,
              color: THEME_COLORS.textSecondary,
              lineHeight: 1.2,
            }}
          >
            {subtitle}
          </span>
        ) : null}
      </div>
    </div>
  );
};
