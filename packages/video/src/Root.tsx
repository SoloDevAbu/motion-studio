import React from "react";
import { Composition } from "remotion";
import { z } from "zod/v4";
import { FullVideoPlanSchema, type FullVideoPlan } from "@motion/schema";
import { MainVideo, type MainVideoProps } from "./compositions/MainVideo";
import { AnimatedPath, type AnimatedPathProps } from "./primitives/AnimatedPath";
import { Comparison, type ComparisonProps } from "./primitives/Comparison";
import { FlowNode, type FlowNodeProps } from "./primitives/FlowNode";
import { KineticText, type KineticTextProps } from "./primitives/KineticText";
import { StatCounter, type StatCounterProps } from "./primitives/StatCounter";
import { VIDEO_CONFIG } from "./styles/theme";

const DEFAULT_PLAN: FullVideoPlan = {
  title: "Building Real-Time Microservices",
  scenes: [
    {
      speech: "Modern cloud architectures depend on low-latency microservices.",
      type: "workflow",
      sfxCue: "pop",
      nodes: [
        {
          id: "node-1",
          label: "API Gateway",
          icon: "lucide:server",
          color: "#3B82F6",
        },
        {
          id: "node-2",
          label: "PostgreSQL Database",
          icon: "lucide:database",
          color: "#06B6D4",
        },
      ],
    },
    {
      speech: "Processing queries over ten times faster with zero server cost.",
      type: "stat_counter",
      sfxCue: "ding",
      statData: {
        prefix: "",
        value: 10,
        suffix: "x",
        label: "Faster Query Execution Time",
      },
    },
    {
      speech: "Transform your static workflows into intelligent autonomous pipelines.",
      type: "comparison",
      sfxCue: "whoosh",
    },
  ],
};

const MainVideoSchema = z.object({
  plan: FullVideoPlanSchema,
  audioUrl: z.string().optional(),
  wordTimestamps: z
    .array(
      z.object({
        word: z.string(),
        startMs: z.number(),
        endMs: z.number(),
      }),
    )
    .optional(),
  defaultSceneDurationFrames: z.number().optional(),
});

const FlowNodeSchema = z.object({
  id: z.string().optional(),
  label: z.string(),
  icon: z.string(),
  color: z.string().optional(),
  delayFrames: z.number().optional(),
  subtitle: z.string().optional(),
});

const StatCounterSchema = z.object({
  value: z.number(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
  label: z.string(),
  color: z.string().optional(),
  delayFrames: z.number().optional(),
  decimals: z.number().optional(),
});

const ComparisonSideSchema = z.object({
  title: z.string(),
  badge: z.string().optional(),
  items: z.array(z.string()),
  color: z.string().optional(),
  icon: z.string().optional(),
});

const ComparisonSchema = z.object({
  left: ComparisonSideSchema,
  right: ComparisonSideSchema,
  delayFrames: z.number().optional(),
});

const PointSchema = z.object({
  x: z.number(),
  y: z.number(),
});

const AnimatedPathSchema = z.object({
  start: PointSchema,
  end: PointSchema,
  controlPoint: PointSchema.optional(),
  color: z.string().optional(),
  delayFrames: z.number().optional(),
  drawDurationFrames: z.number().optional(),
  packetCycleFrames: z.number().optional(),
  label: z.string().optional(),
});

const KineticTextSchema = z.object({
  text: z.string().optional(),
  wordTimestamps: z
    .array(
      z.object({
        word: z.string(),
        startMs: z.number(),
        endMs: z.number(),
      }),
    )
    .optional(),
  accentColor: z.string().optional(),
});

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Master 9:16 vertical composition */}
      <Composition<typeof MainVideoSchema, MainVideoProps>
        id="MainVideo"
        component={MainVideo}
        schema={MainVideoSchema}
        durationInFrames={DEFAULT_PLAN.scenes.length * 90}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        defaultProps={{
          plan: DEFAULT_PLAN,
          defaultSceneDurationFrames: 90,
        }}
      />

      {/* Primitive Previews */}
      <Composition<typeof FlowNodeSchema, FlowNodeProps>
        id="FlowNodePreview"
        component={FlowNode}
        schema={FlowNodeSchema}
        durationInFrames={60}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={400}
        defaultProps={{
          label: "Neon Serverless Postgres",
          icon: "simple-icons:postgresql",
          color: "#06B6D4",
          subtitle: "Auto-scaling HTTP connection",
        }}
      />

      <Composition<typeof StatCounterSchema, StatCounterProps>
        id="StatCounterPreview"
        component={StatCounter}
        schema={StatCounterSchema}
        durationInFrames={60}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={500}
        defaultProps={{
          value: 99.9,
          decimals: 1,
          suffix: "%",
          label: "Zero-Downtime Reliability",
          color: "#10B981",
        }}
      />

      <Composition<typeof ComparisonSchema, ComparisonProps>
        id="ComparisonPreview"
        component={Comparison}
        schema={ComparisonSchema}
        durationInFrames={60}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={800}
        defaultProps={{
          left: {
            title: "Traditional Stack",
            badge: "Legacy",
            items: ["Complex AWS infra", "Expensive servers", "Slow deploys"],
            color: "#F43F5E",
            icon: "lucide:server-crash",
          },
          right: {
            title: "Serverless Edge",
            badge: "Modern",
            items: ["Instant spin-up", "Scale to zero", "Sub-second cold starts"],
            color: "#10B981",
            icon: "lucide:zap",
          },
        }}
      />

      <Composition<typeof AnimatedPathSchema, AnimatedPathProps>
        id="AnimatedPathPreview"
        component={AnimatedPath}
        schema={AnimatedPathSchema}
        durationInFrames={90}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={600}
        defaultProps={{
          start: { x: 200, y: 300 },
          end: { x: 880, y: 300 },
          color: "#A855F7",
          label: "gRPC Streaming",
        }}
      />

      <Composition<typeof KineticTextSchema, KineticTextProps>
        id="KineticTextPreview"
        component={KineticText}
        schema={KineticTextSchema}
        durationInFrames={90}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={300}
        defaultProps={{
          text: "Transform prompts into production-grade vector motion graphics.",
        }}
      />
    </>
  );
};
