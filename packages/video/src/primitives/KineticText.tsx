import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SPRING_PRESETS, THEME_COLORS, VIDEO_CONFIG } from "../styles/theme";

export type WordTimestamp = {
  readonly word: string;
  readonly startMs: number;
  readonly endMs: number;
};

export type KineticTextProps = {
  readonly text?: string;
  readonly wordTimestamps?: WordTimestamp[];
  readonly accentColor?: string;
  readonly style?: React.CSSProperties;
};

export const KineticText: React.FC<KineticTextProps> = ({
  text = "",
  wordTimestamps,
  accentColor = THEME_COLORS.accentAmber,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentTimeMs = (frame / fps) * 1000;

  // Fallback if no explicit word timestamps: split words and estimate evenly across 90 frames (3 seconds)
  const words: WordTimestamp[] = React.useMemo(() => {
    if (wordTimestamps && wordTimestamps.length > 0) {
      return wordTimestamps;
    }
    const tokenized = text.trim().split(/\s+/).filter(Boolean);
    if (tokenized.length === 0) return [];
    const msPerWord = 280;
    return tokenized.map((word, i) => ({
      word,
      startMs: i * msPerWord,
      endMs: (i + 1) * msPerWord,
    }));
  }, [wordTimestamps, text]);

  // Find active word index
  const activeIndex = words.findIndex(
    (w) => currentTimeMs >= w.startMs && currentTimeMs <= w.endMs,
  );

  // Group into display window (chunk of words around active index so text fits vertically)
  const windowSize = 8;
  const windowStart = Math.max(
    0,
    Math.min(
      Math.floor((activeIndex >= 0 ? activeIndex : 0) / windowSize) * windowSize,
      Math.max(0, words.length - windowSize),
    ),
  );
  const visibleWords = words.slice(windowStart, windowStart + windowSize);

  return (
    <div
      style={{
        position: "absolute",
        bottom: `${VIDEO_CONFIG.safeMarginBottom - 80}px`,
        left: `${VIDEO_CONFIG.safeMarginX}px`,
        right: `${VIDEO_CONFIG.safeMarginX}px`,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: "14px 18px",
        padding: "24px 32px",
        borderRadius: "24px",
        backgroundColor: "rgba(9, 9, 11, 0.85)",
        backdropFilter: "blur(20px)",
        border: "1.5px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.6)",
        textAlign: "center",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        ...style,
      }}
    >
      {visibleWords.map((item, localIdx) => {
        const globalIdx = windowStart + localIdx;
        const isActive = globalIdx === activeIndex;
        const isPast = activeIndex !== -1 && globalIdx < activeIndex;

        // Spring punch scale for the newly activated word
        const activeFrame = Math.max(0, frame - Math.floor((item.startMs / 1000) * fps));
        const punch = spring({
          frame: activeFrame,
          fps,
          config: SPRING_PRESETS.bouncy,
        });

        const scale = isActive ? 1.05 + 0.1 * Math.min(1, punch) : 1;

        return (
          <span
            key={`${item.word}-${item.startMs}-${globalIdx}`}
            style={{
              display: "inline-block",
              fontSize: "36px",
              fontWeight: isActive ? 800 : isPast ? 600 : 500,
              color: isActive
                ? "#09090B"
                : isPast
                  ? THEME_COLORS.textPrimary
                  : THEME_COLORS.textMuted,
              backgroundColor: isActive ? accentColor : "transparent",
              padding: isActive ? "6px 16px" : "0px 4px",
              borderRadius: "12px",
              boxShadow: isActive ? `0 0 24px ${accentColor}99` : "none",
              scale: `${scale}`,
              transition: "none",
              letterSpacing: "-0.01em",
              lineHeight: 1.25,
            }}
          >
            {item.word}
          </span>
        );
      })}
    </div>
  );
};
