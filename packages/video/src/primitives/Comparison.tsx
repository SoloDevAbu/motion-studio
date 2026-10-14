import React from "react";
import { Icon } from "@iconify/react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SPRING_PRESETS, THEME_COLORS } from "../styles/theme";

export type ComparisonSide = {
  readonly title: string;
  readonly badge?: string;
  readonly items: string[];
  readonly color?: string;
  readonly icon?: string;
};

export type ComparisonProps = {
  readonly left: ComparisonSide;
  readonly right: ComparisonSide;
  readonly delayFrames?: number;
  readonly style?: React.CSSProperties;
};

export const Comparison: React.FC<ComparisonProps> = ({
  left,
  right,
  delayFrames = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftEntrance = spring({
    frame: frame - delayFrames,
    fps,
    config: SPRING_PRESETS.snappy,
  });

  const rightEntrance = spring({
    frame: frame - delayFrames - 10,
    fps,
    config: SPRING_PRESETS.snappy,
  });

  const clampedLeft = Math.max(0, Math.min(1, leftEntrance));
  const clampedRight = Math.max(0, Math.min(1, rightEntrance));

  const renderSideCard = (
    side: ComparisonSide,
    entrance: number,
    baseDelay: number,
    defaultColor: string,
  ) => {
    const color = side.color ?? defaultColor;

    return (
      <div
        style={{
          flex: 1,
          width: "100%",
          padding: "36px 44px",
          borderRadius: "32px",
          backgroundColor: THEME_COLORS.surface,
          backdropFilter: "blur(20px)",
          border: `2px solid ${color}55`,
          boxShadow: `0 0 40px ${color}22`,
          opacity: entrance,
          scale: `${0.88 + 0.12 * entrance}`,
          transformOrigin: "center center",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {side.icon ? (
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  backgroundColor: `${color}22`,
                  border: `1.5px solid ${color}55`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color,
                }}
              >
                <Icon icon={side.icon} width="32" height="32" />
              </div>
            ) : null}
            <span
              style={{
                fontSize: "36px",
                fontWeight: 700,
                color: THEME_COLORS.textPrimary,
                letterSpacing: "-0.02em",
              }}
            >
              {side.title}
            </span>
          </div>

          {side.badge ? (
            <span
              style={{
                fontSize: "20px",
                fontWeight: 700,
                padding: "6px 16px",
                borderRadius: "999px",
                backgroundColor: `${color}22`,
                color,
                border: `1px solid ${color}66`,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {side.badge}
            </span>
          ) : null}
        </div>

        {/* Item List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {side.items.map((item, i) => {
            const itemEntrance = spring({
              frame: frame - baseDelay - i * 6,
              fps,
              config: SPRING_PRESETS.snappy,
            });
            const clampedItem = Math.max(0, Math.min(1, itemEntrance));

            return (
              <div
                key={`${item}-${i}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  opacity: clampedItem,
                  translate: `${(1 - clampedItem) * -20}px 0px`,
                }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: color,
                    boxShadow: `0 0 12px ${color}`,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: "28px",
                    fontWeight: 500,
                    color: THEME_COLORS.textPrimary,
                    lineHeight: 1.3,
                  }}
                >
                  {item}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
        width: "100%",
        maxWidth: "920px",
        ...style,
      }}
    >
      {renderSideCard(left, clampedLeft, delayFrames, THEME_COLORS.accentRose)}
      {renderSideCard(right, clampedRight, delayFrames + 10, THEME_COLORS.accentEmerald)}
    </div>
  );
};
