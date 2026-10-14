import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { THEME_COLORS } from "../styles/theme";

export interface Point {
  readonly x: number;
  readonly y: number;
}

export type AnimatedPathProps = {
  readonly start: Point;
  readonly end: Point;
  readonly controlPoint?: Point;
  readonly color?: string;
  readonly delayFrames?: number;
  readonly drawDurationFrames?: number;
  readonly packetCycleFrames?: number;
  readonly label?: string;
};

export const AnimatedPath: React.FC<AnimatedPathProps> = ({
  start,
  end,
  controlPoint,
  color = THEME_COLORS.accentCyan,
  delayFrames = 0,
  drawDurationFrames = 20,
  packetCycleFrames = 45,
  label,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Compute quadratic control point if not explicitly provided
  const cp: Point = controlPoint ?? {
    x: (start.x + end.x) / 2 + (start.y === end.y ? 0 : (end.y - start.y) * 0.15),
    y: (start.y + end.y) / 2 - 60,
  };

  const pathData = `M ${start.x} ${start.y} Q ${cp.x} ${cp.y} ${end.x} ${end.y}`;

  // Approximate arc length for stroke dash calculation
  const chord = Math.hypot(end.x - start.x, end.y - start.y);
  const netLen = chord * 1.15;

  const drawProgress = interpolate(
    frame - delayFrames,
    [0, drawDurationFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // Traveling packet calculation along quadratic Bezier curve
  const activeFrame = Math.max(0, frame - delayFrames - drawDurationFrames);
  const packetCycle = activeFrame % packetCycleFrames;
  const t = Math.min(1, Math.max(0, packetCycle / packetCycleFrames));

  // B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
  const oneMinusT = 1 - t;
  const packetX =
    oneMinusT * oneMinusT * start.x + 2 * oneMinusT * t * cp.x + t * t * end.x;
  const packetY =
    oneMinusT * oneMinusT * start.y + 2 * oneMinusT * t * cp.y + t * t * end.y;

  const showPacket = frame >= delayFrames + drawDurationFrames;

  return (
    <svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      <defs>
        <filter id={`glow-${color.replace("#", "")}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background trace line */}
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeOpacity={0.18}
        strokeWidth={4}
        strokeLinecap="round"
      />

      {/* Animated drawing line */}
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeDasharray={`${netLen}`}
        strokeDashoffset={`${netLen * (1 - drawProgress)}`}
        strokeLinecap="round"
        filter={`url(#glow-${color.replace("#", "")})`}
      />

      {/* Traveling glowing packet dot */}
      {showPacket ? (
        <g transform={`translate(${packetX}, ${packetY})`}>
          <circle
            r={18}
            fill={color}
            opacity={0.3}
            filter={`url(#glow-${color.replace("#", "")})`}
          />
          <circle r={9} fill="#FFFFFF" />
          <circle r={6} fill={color} />
        </g>
      ) : null}

      {/* Optional edge label */}
      {label && drawProgress > 0.6 ? (
        <text
          x={cp.x}
          y={cp.y - 18}
          textAnchor="middle"
          fill={THEME_COLORS.textSecondary}
          fontSize="24"
          fontWeight="600"
          fontFamily="Inter, system-ui, sans-serif"
          opacity={drawProgress}
        >
          {label}
        </text>
      ) : null}
    </svg>
  );
};
