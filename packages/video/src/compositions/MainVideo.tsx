import React from "react";
import { Audio } from "@remotion/media";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { FullVideoPlan } from "@motion/schema";
import { AnimatedPath } from "../primitives/AnimatedPath.js";
import { Comparison } from "../primitives/Comparison.js";
import { FlowNode } from "../primitives/FlowNode.js";
import { KineticText, type WordTimestamp } from "../primitives/KineticText.js";
import { StatCounter } from "../primitives/StatCounter.js";
import { THEME_COLORS, VIDEO_CONFIG } from "../styles/theme.js";

export type MainVideoProps = {
  readonly plan: FullVideoPlan;
  readonly audioUrl?: string;
  readonly wordTimestamps?: WordTimestamp[];
  readonly defaultSceneDurationFrames?: number;
};

export const MainVideo: React.FC<MainVideoProps> = ({
  plan,
  audioUrl,
  wordTimestamps,
  defaultSceneDurationFrames = 90,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Background ambient animation
  const bgShiftX = Math.sin(frame * 0.02) * 40;
  const bgShiftY = Math.cos(frame * 0.02) * 40;

  let currentFrameAccumulator = 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: THEME_COLORS.bg,
        width,
        height,
        overflow: "hidden",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Ambient glowing background accents */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "20%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(9, 9, 11, 0) 70%)",
          transform: `translate(${bgShiftX}px, ${bgShiftY}px)`,
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "25%",
          right: "15%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, rgba(9, 9, 11, 0) 70%)",
          transform: `translate(${-bgShiftX}px, ${-bgShiftY}px)`,
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Voiceover Audio Track */}
      {audioUrl ? <Audio src={audioUrl} /> : null}

      {/* Sequenced Scenes */}
      {plan.scenes.map((scene, sceneIndex) => {
        const sceneDuration = defaultSceneDurationFrames;
        const fromFrame = currentFrameAccumulator;
        currentFrameAccumulator += sceneDuration;

        return (
          <Sequence
            key={`scene-${sceneIndex}-${scene.type}`}
            from={fromFrame}
            durationInFrames={sceneDuration}
          >
            <AbsoluteFill
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: `${VIDEO_CONFIG.safeMarginTop}px ${VIDEO_CONFIG.safeMarginX}px ${VIDEO_CONFIG.safeMarginBottom}px`,
              }}
            >
              {scene.type === "workflow" && scene.nodes && scene.nodes.length > 0 ? (
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "64px",
                    width: "100%",
                  }}
                >
                  {scene.nodes.map((node, nodeIdx) => (
                    <FlowNode
                      key={node.id}
                      label={node.label}
                      icon={node.icon}
                      color={node.color}
                      delayFrames={nodeIdx * 8}
                    />
                  ))}

                  {/* Connect adjacent nodes with AnimatedPath if edges exist or sequentially */}
                  {scene.nodes.length >= 2 ? (
                    <AnimatedPath
                      start={{ x: 540, y: 700 }}
                      end={{ x: 540, y: 920 }}
                      delayFrames={8}
                    />
                  ) : null}
                </div>
              ) : null}

              {scene.type === "stat_counter" && scene.statData ? (
                <StatCounter
                  value={scene.statData.value}
                  prefix={scene.statData.prefix}
                  suffix={scene.statData.suffix}
                  label={scene.statData.label}
                  delayFrames={4}
                />
              ) : null}

              {scene.type === "comparison" ? (
                <Comparison
                  left={{
                    title: "The Old Way",
                    badge: "Slow",
                    items: ["Manual keyframing", "Hours in After Effects", "Costly render farms"],
                    color: THEME_COLORS.accentRose,
                    icon: "lucide:clock-alert",
                  }}
                  right={{
                    title: "With MotionCraft",
                    badge: "Instant",
                    items: ["Prompt to video in 30s", "Programmatic vector math", "Zero infrastructure cost"],
                    color: THEME_COLORS.accentEmerald,
                    icon: "lucide:sparkles",
                  }}
                  delayFrames={4}
                />
              ) : null}

              {scene.type === "kinetic_quote" ? (
                <div
                  style={{
                    maxWidth: "880px",
                    textAlign: "center",
                    fontSize: "56px",
                    fontWeight: 800,
                    lineHeight: 1.25,
                    color: THEME_COLORS.textPrimary,
                    textShadow: "0 0 30px rgba(255,255,255,0.2)",
                  }}
                >
                  &ldquo;{scene.speech}&rdquo;
                </div>
              ) : null}
            </AbsoluteFill>
          </Sequence>
        );
      })}

      {/* Global persistent word-synced subtitles at bottom safe zone */}
      <KineticText
        text={plan.scenes.map((s) => s.speech).join(" ")}
        wordTimestamps={wordTimestamps}
      />
    </AbsoluteFill>
  );
};
